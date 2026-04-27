using AzubiVerwaltungBackEnd.Data;
using AzubiVerwaltungBackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AzubiVerwaltungBackEnd.Controllers
{
    [ApiController] // Kennzeichnet die Klasse als API-Controller
    [Route("api/[controller]")] // Erreichbar unter api/auth
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        // Der Constructor holt sich den DB-Kontext (Dependency Injection)
        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // User suchen
            var user = await _context.Azubis
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            // Prüfen, ob User existiert
            if (user == null)
            {
                return Unauthorized(new { message = "Email unbekannt" });
            }

            // Passwort prüfen mit BCrypt
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.passwordhash.Trim()))
            {
                return Unauthorized(new { message = "Passwort falsch" });
            }

            // Token generieren
            var token = GenerateJwtToken(user);

            //Token UND den Vornamen zurück
            return Ok(new
            {
                message = "Login erfolgreich",
                token = token,           
                username = user.FirstName,
                isAdmin = user.AdminRights,
                userId = user.UserId
            });
        }
        private string GenerateJwtToken(Azubi user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Claims sind die "Stempel" im Pass (Wer bist du? Was darfst du?)
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FirstName),
                new Claim("Admin", user.AdminRights ? "1" : "0"), // Eigener Claim für Rechte
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(8), // Token ist 8h gültig
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}