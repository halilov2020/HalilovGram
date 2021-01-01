using HalilovGram.Entities;
using HalilovGram.Entities.Models;
using HalilovGram.Payloads;
using HalilovGram.ViewModels.Post;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using static HalilovGram.Enums;

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
        public ActionResult<List<FeedPost>> GetAll(int pageSize, int pageNumber, FeedSortType sortType)
        {
            try
            {
                var result = _db.Posts.Join(    // first set
                _db.Users,                      // second set
                p => p.UserId,                  // selector property of object from first set
                u => u.Id,                      // selector property of object from second set
                (p, u) => new FeedPost          // creating new type of join set
                {                               // finall fields of a new set
                    Id = p.Id,
                    Title = p.Title,
                    Text = p.Text,
                    ImgUrl = p.ImgUrl,
                    Likes = p.Likes,
                    Date = p.Date,
                    Author = u.FirstName + " " + u.LastName
                }).AsNoTracking();

                switch (sortType)
                {
                    case FeedSortType.POPULAR_ASCENDING:
                        result = result.OrderBy(p => p.Likes);
                        break;
                    case FeedSortType.POPULAR_DESCENDING:
                        result = result.OrderByDescending(p => p.Likes);
                        break;
                    case FeedSortType.NEWEST_ASCENDING:
                        result = result.OrderBy(p => p.Date);
                        break;
                    case FeedSortType.NEWEST_DESCENDING:
                        result = result.OrderByDescending(p => p.Date);
                        break;
                    
                }

                result = result
                    .Skip(pageNumber * pageSize)
                    .Take(pageSize);
                return result.ToList();
            }catch(Exception ex)
            {
                return StatusCode(500, $"Internal server error {ex}");
            }
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
        [HttpGet]
        public IActionResult Like(int postId)
        {
            String[] authorization = Request.Headers["authorization"].ToString().Split(" ");
            String token = authorization[authorization.Length - 1];
            var userId = ((JwtSecurityToken)new JwtSecurityTokenHandler().ReadToken(token)).Claims.First(claim => claim.Type == "id").Value;
            try
            {
                var likeExists = _db.Likes.Where(l => l.PostId == postId && l.UserId == Int32.Parse(userId));
                if (likeExists == null)
                {
                    var like = new Like
                    {
                        PostId = postId,
                        UserId = Int32.Parse(userId),
                    };
                    _db.Likes.Add(like);
                    _db.SaveChanges();

                    return Ok(new { message = "like success" });
                }
                else
                {
                    _db.Likes.Remove((Like)likeExists);
                    _db.SaveChanges();
                    return Ok(new { message = "like deleted" });
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpGet]
        public IActionResult IsLiked(int postId)
        {
            String[] authorization = Request.Headers["authorization"].ToString().Split(" ");
            String token = authorization[authorization.Length - 1];
            var userId = ((JwtSecurityToken)new JwtSecurityTokenHandler().ReadToken(token)).Claims.First(claim => claim.Type == "id").Value;
            try
            {
                var likeExists = _db.Likes.Where(l => l.PostId == postId && l.UserId == Int32.Parse(userId));
                if (likeExists == null)
                {
                    return Ok(new { isLiked = false });
                }
                else
                {
                    return Ok(new { isLiked = true });
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
        
        [HttpGet]
        public IActionResult NumLikes(int postId)
        {
           try
           {
               var numLikes = _db.Likes.Where(l => l.PostId == postId).Count();
               return Ok(new { numLikes });
           }
           catch (Exception ex)
           {
               return StatusCode(500, $"Internal server error: {ex}");
           }
        }
    }
}
