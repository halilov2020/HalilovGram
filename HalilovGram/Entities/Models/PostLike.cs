namespace HalilovGram.Entities.Models
{
    public class PostLike
    {
        public int Id { get; set; }
        public int PostId { get; set; }
        public int UserId { get; set; }
        public bool IsDeleted { get; set; }
        public Post Post { get; set; }
        public User User { get; set; }
    }
}
