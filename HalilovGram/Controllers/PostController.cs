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
                var result = _db.Posts
                    .Include(u => u.User)
                    .Select(p => new FeedPost
                    {
                        Id = p.Id,
                        Title = p.Title,
                        Text = p.Text,
                        ImgUrl = p.ImgUrl,
                        Likes = p.Likes,
                        Date = p.Date,
                        Author = p.User.FirstName + " " + p.User.LastName
                    })
                    .AsNoTracking();

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
        [HttpGet]
        public ActionResult<FeedPost> GetPostById(int postId)
        {
            try
            {
                var post = _db.Posts
                    .Include(u => u.User)
                    .SingleOrDefault(p => p.Id == postId);

                if(post != null)
                {
                    FeedPost feedPost = new FeedPost
                    {
                        Id = post.Id,
                        Title = post.Title,
                        Text = post.Text,
                        ImgUrl = post.ImgUrl,
                        Likes = post.Likes,
                        Date = post.Date,
                        Author = post.User.FirstName + " " + post.User.LastName
                    };

                    return feedPost;
                }
                return StatusCode(204, "No content");
            }
            catch(Exception ex)
            {
                return StatusCode(500, $"Internal server error {ex}");
            }
        }
        [HttpPost]
        public IActionResult CreatePost([FromBody] PostPayload payload)
        {
            String[] authorization = Request.Headers["authorization"].ToString().Split(" ");
            var token = authorization[1];
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
            String token = authorization[1];
            String userId = ((JwtSecurityToken)new JwtSecurityTokenHandler().ReadToken(token)).Claims.First(claim => claim.Type == "id").Value;
            try
            {
                var likeExists = _db.PostLikes.SingleOrDefault(l => l.PostId == postId && l.UserId == Int32.Parse(userId));
                if (likeExists == null)
                {
                    var like = new PostLike
                    {
                        PostId = postId,
                        UserId = Int32.Parse(userId),
                    };
                    _db.PostLikes.Add(like);
                    var numLikes = ++_db.Posts.Single(p => p.Id == postId).Likes;
                    _db.SaveChanges();

                    return Ok(new { message = "like success", numLikes});
                }
                else
                {
                    _db.PostLikes.Remove(likeExists);
                    var numLikes = --_db.Posts.Single(p => p.Id == postId).Likes;
                    _db.SaveChanges();
                    return Ok(new { message = "like deleted", numLikes });
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
            String token = authorization[1];
            String userId = ((JwtSecurityToken)new JwtSecurityTokenHandler().ReadToken(token)).Claims.First(claim => claim.Type == "id").Value;
            try
            {
                var likeExists = _db.PostLikes.SingleOrDefault(l => l.PostId == postId && l.UserId == Int32.Parse(userId));
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
    }
}
