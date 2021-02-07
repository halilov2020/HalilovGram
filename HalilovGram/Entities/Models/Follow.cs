using System;

namespace HalilovGram.Entities.Models
{
    public class Follow
    {
        public int Id { get; set; }
        public int FollowedById { get; set; }
        public int FollowsId { get; set; }
        public DateTime DateOfFollow { get; set; }
        public User FollowedBy { get; set; }
        public User Follows { get; set; }
        public bool IsDeleted { get; set; }
    }
}
