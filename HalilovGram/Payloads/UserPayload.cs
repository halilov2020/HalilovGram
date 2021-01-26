﻿using System;

namespace HalilovGram.Payloads
{
    public class UserPayload
    {
        public int? Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string ImgUrl { get; set; }
        public string Gender { get; set; }
    }
}
