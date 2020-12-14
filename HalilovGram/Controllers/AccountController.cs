﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using HalilovGram.Entities;
using HalilovGram.Entities.Models;
using HalilovGram.Payloads;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using BC = BCrypt.Net.BCrypt;
namespace HalilovGram.Controllers
{
    //[Route("api/[controller]")]
    //[ApiController]
    public class AccountController : ControllerBase
    {
        private IConfiguration _config { get; }
        private readonly HalilovGramContext _db;
        
        public AccountController(HalilovGramContext db, IConfiguration configuration)
        {
            _config = configuration;
            _db = db;
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Register([FromBody] RegisterPayload registerPayload)
        {
            try
            {
                var existingUserWithEmail = _db.Users.Any(u => u.Email == registerPayload.Email);
                if (existingUserWithEmail == false)
                {
                    _db.Users.Add(new User
                    {
                        FirstName = registerPayload.FirstName,
                        LastName = registerPayload.LastName,
                        Email = registerPayload.Email,
                        PasswordHash = BC.HashPassword(registerPayload.Password),
                        Gender = registerPayload.Gender
                    });
                    _db.SaveChanges();
                    return Ok(new { status = true, message = "User was registered with success!" });
                }
                else
                {
                    return BadRequest(new { status = false, message = "User with this email exist!" });
                }
            }
            catch
            {
                return new StatusCodeResult(StatusCodes.Status400BadRequest);
            }
        }
        [AllowAnonymous]
        [HttpPost]
        public IActionResult Login([FromBody] LoginPayload loginPayload)
        {
            var foundUser = _db.Users.SingleOrDefault(u => u.Email == loginPayload.Email);
            if (foundUser != null)
            {
                if (BC.Verify(loginPayload.Password, foundUser.PasswordHash))
                {
                    string tokenString = GenerateJSONWebToken(foundUser);
                    return Ok(new { status = true, token = tokenString});
                }
                return BadRequest(new { status = false, message = "Wrong password or email!" });
            }
            else
            {
                return BadRequest(new { status = false, message = "No user with this email found!" });
            }
        }

        private string GenerateJSONWebToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.Email, user.Email)
            };

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
              _config["Jwt:Issuer"],
              claims,
              expires: DateTime.Now.AddDays(30),
              signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}