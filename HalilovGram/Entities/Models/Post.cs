using System;
using System.Collections.Generic;

namespace HalilovGram.Entities.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public string ImgUrl { get; set; }
        public DateTime Date { get;set; }
        public int Likes { get; set; }
        public bool IsDeleted { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public List<PostLike> UsersLiked { get; set; }
    }
}
