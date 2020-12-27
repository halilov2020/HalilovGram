using HalilovGram.Entities;
using HalilovGram.Entities.Models;
using HalilovGram.Payloads;
using HalilovGram.ViewModels.Post;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace HalilovGram.Controllers
{
    [Authorize]
    public class PostController : ControllerBase
    {
        private readonly HalilovGramContext _db;
        public PostController(HalilovGramContext db)
        {
            _db = db;
        }
        [HttpGet]
        public ActionResult<List<FeedPost>> GetAllByUser()
        {

            var result = _db.Posts.Join(    // first set
                _db.Users,                  // second set
                p => p.UserId,              // selector property of object from first set
                u => u.Id,                  // selector property of object from second set
                (p, u) => new FeedPost      // creating new type of join set
                {                           // finall fields of a new set
                    Id = p.Id,
                    Title = p.Title,
                    Text = p.Text,
                    ImgUrl = p.ImgUrl,
                    Author = u.FirstName + " " + u.LastName

                });
            return result.ToList();
        }

        [HttpPost]
        public ActionResult<Post> CreatePost([FromBody] PostPayload payload)
        {
            String[] authorization = Request.Headers["authorization"].ToString().Split(" ");
            var token = authorization[authorization.Length - 1];
            var id = ((JwtSecurityToken) new JwtSecurityTokenHandler().ReadToken(token)).Claims.First(claim => claim.Type == "id").Value;
            try
            {
                var newPost = new Post
                {
                    Title = payload.Title,
                    Text = payload.Text,
                    ImgUrl = payload.ImgUrl,
                    Date = DateTime.Now,
                    UserId = Int32.Parse(id)
                };

                _db.Posts.Add(newPost);
                _db.SaveChanges();
                return Ok(new { message = "success" });

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error {ex}");
            }
        }

        [HttpPost, DisableRequestSizeLimit]
        public IActionResult UploadImage()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "Images", "Posts");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }

        }
    }
}
