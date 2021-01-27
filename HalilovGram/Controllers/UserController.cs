using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using HalilovGram.Entities;
using HalilovGram.Entities.Models;
using HalilovGram.Payloads;
using HalilovGram.ViewModels.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BC = BCrypt.Net.BCrypt;

namespace HalilovGram.Controllers
{
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly HalilovGramContext _db;
        public UserController(HalilovGramContext db)
        {
            _db = db;
        }

        [HttpGet]
        public ActionResult<List<User>> GetAll()
        {
            return _db.Users.ToList();
        }

        [HttpGet]
        public ActionResult<ProfileUser> GetById(int Id)
        {
            try
            {
                return _db.Users.Where(user => Id == user.Id).Select(u => new ProfileUser {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    ImgUrl = u.ImgUrl,
                    City = u.City,
                    Country = u.Country,
                    DateOfBirth = u.DateOfBirth,
                    Gender = u.Gender
                }).Single();
            }
            catch (Exception)
            {
                return new StatusCodeResult(StatusCodes.Status400BadRequest);
            }
        }

        [HttpPost]
        public ActionResult<User> Update([FromBody] UserPayload payload)
        {
            String[] authorization = Request.Headers["authorization"].ToString().Split(" ");
            String token = authorization[authorization.Length - 1];
            String id = ((JwtSecurityToken) new JwtSecurityTokenHandler().ReadToken(token)).Claims.First(claim => claim.Type == "id").Value;

            try
            {
                var selectedUser = _db.Users.Single(u => u.Id == Int32.Parse(id));

                selectedUser.FirstName = payload.FirstName;
                selectedUser.LastName = payload.LastName;
                selectedUser.Email = payload.Email;
                selectedUser.Gender = payload.Gender;
                selectedUser.DateOfBirth = payload.DateOfBirth;
                selectedUser.City = payload.City;
                selectedUser.Country = payload.Country;
                selectedUser.ImgUrl = payload.ImgUrl;

                _db.SaveChanges();
                return Ok(new { message = "success" });
            }
            catch(Exception)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }
        
        [HttpPost]
        public IActionResult UploadAvatar()
        {
            String[] authorization = Request.Headers["authorization"].ToString().Split(" ");
            String token = authorization[authorization.Length - 1];
            String id = ((JwtSecurityToken) new JwtSecurityTokenHandler().ReadToken(token)).Claims.First(claim => claim.Type == "id").Value;
            try
            {
               var selectedUser = _db.Users.Single(u => u.Id == Int32.Parse(id));
               if(selectedUser.ImgUrl != null)
                {
                    var urlImg = selectedUser.ImgUrl;
                    var fullPath = Path.Combine(Directory.GetCurrentDirectory(), urlImg);
                    if (System.IO.File.Exists(fullPath))
                    {
                        System.IO.File.Delete(fullPath);
                    }
                }
                var avatar = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "Images", "Avatars");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                if (avatar.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(avatar.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        avatar.CopyTo(stream);
                    }
                    return Ok(new { dbPath });

                }
                else
                {
                    return BadRequest();
                }
            } catch(Exception ex)
            {
                return StatusCode(500, $"Internal server error {ex}");
            }
        }
        [HttpGet]
        public IActionResult GetUserAvatar()
        {
            String[] authorization = Request.Headers["authorization"].ToString().Split(" ");
            String token = authorization[authorization.Length - 1];
            String id = ((JwtSecurityToken)new JwtSecurityTokenHandler().ReadToken(token)).Claims.First(claim => claim.Type == "id").Value;
            try
            {
                var selectedUser = _db.Users.SingleOrDefault(u => u.Id == Int32.Parse(id));
                return Ok(new { selectedUser.ImgUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error {ex}");
            }
        }
        [HttpDelete]
        public ActionResult DeleteAccount()
        {
            String[] authorization = Request.Headers["authorization"].ToString().Split(" ");
            String token = authorization[authorization.Length - 1];
            int id = Int32.Parse(((JwtSecurityToken)new JwtSecurityTokenHandler().ReadToken(token)).Claims.First(claim => claim.Type == "id").Value);
            try
            {
                _db.Users.Find(id).IsDeleted = true;
                _db.Comments.Where(u => u.UserId == id).ToList().ForEach(u => u.IsDeleted = true);
                _db.Follows.Where(u => u.FollowedById == id).ToList().ForEach(u => u.IsDeleted = true);
                _db.Follows.Where(u => u.FollowsId == id).ToList().ForEach(u => u.IsDeleted = true);
                _db.Posts.Where(u => u.UserId == id).ToList().ForEach(u => u.IsDeleted = true);
                _db.SaveChanges();
                return Ok(new { status = true });
            }
            catch (Exception)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
