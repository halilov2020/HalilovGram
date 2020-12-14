using HalilovGram.Entities;
using HalilovGram.Entities.Models;
using HalilovGram.Payloads;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HalilovGram.Controllers
{
    public class PostController : ControllerBase
    {
        private HalilovGramContext _db;

        public PostController(HalilovGramContext db)
        {
            _db = db;
        }

        public ActionResult<List<Post>> GetAllByUser()
        {
            return _db.Posts.ToList();
        }

        public ActionResult<Post> Create([FromBody] PostPayload payload)
        {
            try
            {
                var newPost = new Post { Text = payload.Text };
                _db.Posts.Add(newPost);
                _db.SaveChanges();
                return Ok(newPost);
            }
            catch (Exception)
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
