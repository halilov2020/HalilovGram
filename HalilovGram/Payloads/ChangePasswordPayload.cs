using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HalilovGram.Payloads
{
    public class ChangePasswordPayload
    {
        public string Password { get; set; }
        public string NewPassword { get; set; }
    }
}
