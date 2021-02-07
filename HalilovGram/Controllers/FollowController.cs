using HalilovGram.Entities;
using HalilovGram.Entities.Models;
using HalilovGram.ViewModels.Follow;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;

namespace HalilovGram.Controllers
{
    [Authorize]
    public class FollowController : ControllerBase
    {
        private readonly HalilovGramContext _db;
        public FollowController(HalilovGramContext db)
        {
            _db = db;
        }

        [HttpGet]
        public IActionResult Follow(int userToFollowId)
        {
            String[] authorization = Request.Headers["authorization"].ToString().Split(" ");
            String token = authorization[1];
            String followingUserId = ((JwtSecurityToken)new JwtSecurityTokenHandler().ReadToken(token)).Claims.First(claim => claim.Type == "id").Value;

            try
            {
                var followExists = _db.Follows.SingleOrDefault(f => f.FollowedById == Int32.Parse(followingUserId) && f.FollowsId == userToFollowId);
                if (followExists == null) 
                {
                    var newFollow = new Follow
                    {
                        FollowedById = Int32.Parse(followingUserId),
                        FollowsId = userToFollowId,
                        DateOfFollow = DateTime.Now
                    };
                    _db.Follows.Add(newFollow);
                    _db.SaveChanges();
                    return Ok(new { message = "follow success" });
                } else
                {
                    return BadRequest();
                }
            }
            catch(Exception ex)
            {
                return StatusCode(500, $"Internal server error {ex}");
            }
        }

        [HttpGet]
        public IActionResult UnFollow(int userToFollowId)
        {
            String[] authorization = Request.Headers["authorization"].ToString().Split(" ");
            String token = authorization[1];
            String followingUserId = ((JwtSecurityToken)new JwtSecurityTokenHandler().ReadToken(token)).Claims.First(claim => claim.Type == "id").Value;

            try
            {
                var followExists = _db.Follows.SingleOrDefault(f => f.FollowedById == Int32.Parse(followingUserId) && f.FollowsId == userToFollowId);
                if (followExists != null)
                {
                    _db.Follows.Remove(followExists);
                    _db.SaveChanges();
                    return Ok(new { message = "unfollow success" });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error {ex}");
            }
        }

        [HttpGet]
        public IActionResult IsFollowed(int userToFollowId)
        {
            String[] authorization = Request.Headers["authorization"].ToString().Split(" ");
            String token = authorization[1];
            String followingUserId = ((JwtSecurityToken)new JwtSecurityTokenHandler().ReadToken(token)).Claims.First(claim => claim.Type == "id").Value;

            try
            {
                var followExists = _db.Follows.SingleOrDefault(f => f.FollowedById == Int32.Parse(followingUserId) && f.FollowsId == userToFollowId);
                if (followExists == null)
                    return Ok(new { isFollowed = false });
                else
                    return Ok(new { isFollowed = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error {ex}");
            }
        }

        [HttpGet]
        public ActionResult<List<UserViewModel>> GetFollowers(int userId)
        {
            try
            {
                var user = _db.Users
                .Include(u => u.FollowsUsers)
                .ThenInclude(f => f.FollowedBy)
                .SingleOrDefault(u => u.Id == userId);
                var followers = user.FollowsUsers.Select(followed => followed.FollowedBy).ToList();

                var viewModels = new List<UserViewModel>();

                for (int i = 0; i < followers.Count; i++)
                {
                    var viewModel = new UserViewModel
                    {
                        Id = followers[i].Id,
                        FirstName = followers[i].FirstName,
                        LastName = followers[i].LastName,
                        ImgUrl = followers[i].ImgUrl
                    };
                    viewModels.Add(viewModel);
                }
                return Ok(viewModels);
            }
            catch(Exception ex)
            {
                return StatusCode(500, $"Internal server error {ex}");
            }
        }
        [HttpGet]
        public ActionResult<List<UserViewModel>> GetFollowings(int userId)
        {
            try
            {
                var user = _db.Users
                .Include(u => u.FollowedUsers)
                .ThenInclude(f => f.Follows)
                .SingleOrDefault(u => u.Id == userId);
                var followers = user.FollowedUsers.Select(follows => follows.Follows).ToList();

                var viewModels = new List<UserViewModel>();

                for (int i = 0; i < followers.Count; i++)
                {
                    var viewModel = new UserViewModel
                    {
                        Id = followers[i].Id,
                        FirstName = followers[i].FirstName,
                        LastName = followers[i].LastName,
                        ImgUrl = followers[i].ImgUrl
                    };
                    viewModels.Add(viewModel);
                }
                return Ok(viewModels);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error {ex}");
            }
        }
    }
}
