using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HalilovGram.Entities;
using HalilovGram.Entities.Models;
using HalilovGram.Payloads;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using BC = BCrypt.Net.BCrypt;

namespace HalilovGram.Controllers
{
    [AllowAnonymous]
    public class UserController : ControllerBase
    {
        private HalilovGramContext _db;
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
        public ActionResult<User> GetById(int Id)
        {
            try
            {
                return _db.Users.Single(user => Id == user.Id);
            }
            catch (Exception)
            {
                return new StatusCodeResult(StatusCodes.Status400BadRequest);
            }
        }

        [HttpPost]
        public ActionResult<User> Create([FromBody] UserPayload payload)
        {
            try
            {
                var userToAdd = new User
                {
                    FirstName = payload.FirstName,
                    LastName = payload.LastName,
                    Email = payload.Email,
                    PasswordHash = BC.HashPassword(payload.Password),
                    Gender = payload.Gender
                };
                _db.Users.Add(userToAdd);
                _db.SaveChanges();
                return Ok(userToAdd);
            } catch (Exception)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPost]
        public ActionResult<User> Update([FromBody] UserPayload payload)
        {
            try
            {
                if (payload.Id.HasValue)
                {
                    var userToUpdate = _db.Users.SingleOrDefault(user => payload.Id.Value == user.Id);
                    userToUpdate.FirstName = payload.FirstName;
                    userToUpdate.LastName = payload.LastName;
                    userToUpdate.Email = payload.Email;
                    userToUpdate.PasswordHash = BC.HashPassword(payload.Password);
                    userToUpdate.Gender = payload.Gender;

                    _db.SaveChanges();
                    return Ok(userToUpdate);
                }
                else
                {
                    return new StatusCodeResult(StatusCodes.Status400BadRequest);
                }
            }
            catch(Exception)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }
        
        [HttpDelete]
        public ActionResult Delete(int Id)
        {
            try
            {
                var userToDelete = _db.Users.Single(user => user.Id == Id);
                _db.Users.Remove(userToDelete);
                _db.SaveChanges();
                return Ok(new { status=true });
            }
            catch (Exception)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
