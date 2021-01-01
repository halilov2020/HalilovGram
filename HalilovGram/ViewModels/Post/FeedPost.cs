using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HalilovGram.ViewModels.Post
{
    public class FeedPost
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public string ImgUrl { get; set; }
        public int Likes { get; set; }
        public DateTime Date { get; set; }
        public string Author { get; set; }
    }
}
