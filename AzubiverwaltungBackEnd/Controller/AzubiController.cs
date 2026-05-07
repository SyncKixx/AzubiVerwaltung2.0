using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AzubiVerwaltungBackEnd.Data;
using AzubiVerwaltungBackEnd.Models;
using AzubiVerwaltungBackEnd.DTO_s;

[Route("api/[controller]")]
[ApiController]
public class AzubiController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AzubiController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/azubi
    [HttpGet("getAzubis")]
    public async Task<ActionResult<IEnumerable<Azubi>>> GetAzubis()
    {
        // Holt alle Azubis aus db
        var azubis = await _context.Azubis
        .Where(a => a.isDeleted == false)
        .Select(a => new
        {
            a.UserId,
            a.FirstName,
            a.LastName,
            a.Email,
            a.AdminRights
        })
     .ToListAsync();

        return Ok(azubis);
    }
    [HttpPost("addAzubi")]
    public async Task<ActionResult<object>> CreateAzubi([FromBody] Azubi neuerAzubi)
    {
        var emailExists = await _context.Azubis.AnyAsync(a => a.Email.ToLower() == neuerAzubi.Email.ToLower());
        if (emailExists)
        {
            return BadRequest(new { message = "Diese E-Mail-Adresse wird bereits verwendet." });
        }

        neuerAzubi.passwordhash = BCrypt.Net.BCrypt.HashPassword(neuerAzubi.passwordhash);

        neuerAzubi.CreatedAt = DateTime.Now;

        neuerAzubi.AdminRights = false;

        _context.Azubis.Add(neuerAzubi);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Azubi erfolgreich angelegt",
            azubi = new
            {
                neuerAzubi.UserId,
                neuerAzubi.FirstName,
                neuerAzubi.LastName,
                neuerAzubi.Email,
                neuerAzubi.AdminRights
            }
        });
    }
    [HttpPut("softDelete/{id}")]
    public async Task<IActionResult> SoftDeleteAzubi(int id)
    {
        var azubi = await _context.Azubis.FindAsync(id); 
        if (azubi == null) return NotFound("Azubi nicht gefunden.");

        azubi.isDeleted = true; 
        await _context.SaveChangesAsync();

        return Ok();
    }
    


}