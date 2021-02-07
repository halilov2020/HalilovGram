using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using HalilovGram.Entities;
using HalilovGram.Entities.Models;
using HalilovGram.Payloads;
using HalilovGram.ViewModels.Post;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static HalilovGram.Enums;

namespace HalilovGram.Controllers
{
    public class CommentController : ControllerBase
    {
        private readonly HalilovGramContext _db;
        public CommentController(HalilovGramContext db)
        {
            _db = db;
        }
        [HttpPost]
        public IActionResult AddComment([FromBody] CommentPayload payload)
        {
            String[] authorization = Request.Headers["authorization"].ToString().Split(" ");
            String token = authorization[1];
            String userId = ((JwtSecurityToken)new JwtSecurityTokenHandler().ReadToken(token)).Claims.First(claim => claim.Type == "id").Value;
            try
            {
                Comment comment = new Comment
                {
                    Text = payload.Text,
                    Date = DateTime.Now,
                    PostId = payload.PostId,
                    UserId = Int32.Parse(userId)
                };
                _db.Comments.Add(comment);
                _db.SaveChanges();
                return Ok(new { message = "comment added" });
            }catch(Exception ex)
            {
                return StatusCode(500, $"Internal server error {ex}");
            }
        }

        [HttpGet]
        public ActionResult<List<CommentPost>> GetComments(int postId, int pageNumber, int pageSize, CommentSortType sortType)
        {
            try
            {
                var result = _db.Comments
                    .Include(u => u.User)
                    .Where(p => p.Post.Id == postId)
                    .Select(comm => new CommentPost
                    {
                        Id = comm.Id,
                        Text = comm.Text,
                        Date = comm.Date,
                        Author = comm.User.FirstName + " " + comm.User.LastName,
                        ImgUrl = comm.User.ImgUrl,
                        Likes = comm.Likes
                    })
                    .AsNoTracking();

                switch (sortType)
                {
                    case CommentSortType.POPULAR_ASCENDING:
                        result = result.OrderBy(p => p.Likes);
                        break;
                    case CommentSortType.POPULAR_DESCENDING:
                        result = result.OrderByDescending(p => p.Likes);
                        break;
                    case CommentSortType.NEWEST_ASCENDING:
                        result = result.OrderBy(p => p.Date);
                        break;
                    case CommentSortType.NEWEST_DESCENDING:
                        result = result.OrderByDescending(p => p.Date);
                        break;

                }
                result = result
                    .Skip(pageNumber * pageSize)
                    .Take(pageSize);
                return result.ToList();
            }
            catch(Exception ex)
            {
                return StatusCode(500, $"Internal server error {ex}");
            }
        }
        public IActionResult LikeComment(int commentId)
        {
            String[] authorization = Request.Headers["authorization"].ToString().Split(" ");
            String token = authorization[1];
            String userId = ((JwtSecurityToken)new JwtSecurityTokenHandler().ReadToken(token)).Claims.First(claim => claim.Type == "id").Value;
            try
            {
                var likeExists = _db.CommentLikes.SingleOrDefault(l => l.CommentId == commentId && l.UserId == Int32.Parse(userId));
                if (likeExists == null)
                {
                    var like = new CommentLike
                    {
                        CommentId = commentId,
                        UserId = Int32.Parse(userId),
                    };
                    _db.CommentLikes.Add(like);
                    var numLikes = ++_db.Comments.Single(p => p.Id == commentId).Likes;
                    _db.SaveChanges();

                    return Ok(new { message = "like success", numLikes });
                }
                else
                {
                    _db.CommentLikes.Remove(likeExists);
                    var numLikes = --_db.Comments.Single(p => p.Id == commentId).Likes;
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
        public IActionResult IsLiked(int commentId)
        {
            String[] authorization = Request.Headers["authorization"].ToString().Split(" ");
            String token = authorization[1];
            String userId = ((JwtSecurityToken)new JwtSecurityTokenHandler().ReadToken(token)).Claims.First(claim => claim.Type == "id").Value;
            try
            {
                var likeExists = _db.CommentLikes.SingleOrDefault(l => l.CommentId == commentId && l.UserId == Int32.Parse(userId));
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
