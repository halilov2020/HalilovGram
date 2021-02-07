using System;

namespace HalilovGram.ViewModels.Post
{
    public class CommentPost
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime Date { get; set; }
        public string Author { get; set; }
        public string ImgUrl { get; set; }
        public int Likes { get; set; }

    }
}
