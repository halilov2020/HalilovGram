using System;
using System.Collections.Generic;

namespace HalilovGram.Entities.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string ImgUrl { get; set;  }
        public string City { get; set; }
        public string Country { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string PasswordHash { get; set; }
        public string Gender { get; set; }
        public List<Post> Posts { get; set; }
        public List<Follow> FollowsUsers { get; set; }
        public List<Follow> FollowedUsers { get; set; }
        public List<PostLike> LikedPosts { get; set; }
        public List<Comment> Comments { get; set; }
        public List<CommentLike> LikedComments { get; set; }
    }
}
