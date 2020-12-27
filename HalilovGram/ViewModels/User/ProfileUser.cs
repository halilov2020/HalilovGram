using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HalilovGram.ViewModels.User
{
    public class ProfileUser
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string ImgUrl { get; set; }
        public int Age { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
    }
}
