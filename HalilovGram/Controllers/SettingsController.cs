using HalilovGram.Entities;
using HalilovGram.Payloads;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using BC = BCrypt.Net.BCrypt;

namespace HalilovGram.Controllers
{
    public class SettingsController : ControllerBase
    {
        private readonly HalilovGramContext _db;
        public SettingsController(HalilovGramContext db)
        {
            _db = db;
        }

        [HttpPost]
        public IActionResult ChangePassword([FromBody] ChangePasswordPayload payload)
        {
            String[] authorization = Request.Headers["authorization"].ToString().Split(" ");
            String token = authorization[1];
            String userId = ((JwtSecurityToken)new JwtSecurityTokenHandler().ReadToken(token)).Claims.First(claim => claim.Type == "id").Value;
            try
            {
                var selectedUser = _db.Users.Find(Int32.Parse(userId));
                if(BC.Verify(payload.Password, selectedUser.PasswordHash))
                {
                    selectedUser.PasswordHash = BC.HashPassword(payload.NewPassword);
                    _db.SaveChanges();
                    return Ok(new { message = true });
                }
                else
                {
                    return StatusCode(401, "Wrong password!");
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
    }
}
