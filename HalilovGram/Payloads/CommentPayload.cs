using System.ComponentModel.DataAnnotations;

namespace HalilovGram.Payloads
{
    public class CommentPayload
    {
        [Required]
        public string Text { get; set; }
        [Required]
        public int PostId { get; set; }
    }
}
