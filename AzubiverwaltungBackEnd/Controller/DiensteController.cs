using AzubiVerwaltungBackEnd.Data;
using AzubiVerwaltungBackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AzubiverwaltungBackEnd.Controller
{
    [ApiController]
    [Route("api/[controller]")] 
    public class DiensteController: ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public DiensteController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet("getDienste")]
        public async Task<ActionResult<IEnumerable<Dienst>>> GetAufgaben()
        {
            var dienste = await _context.Dienste.Where(a => !a.IsDeleted).ToListAsync();
            return Ok(dienste);
        }

        [HttpPost("addDienst")]
        public async Task<ActionResult<IEnumerable<Dienst>>> CreateAufgaben([FromBody] Dienst newDienst)
        {
            _context.Dienste.Add(newDienst);

            await _context.SaveChangesAsync();
            return Ok(newDienst);
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAufgabe(int id)
        {
            var aufgabe = await _context.Dienste.FindAsync(id);
            if (aufgabe == null)
            {
                return NotFound(new { message = "Aufgabe nicht gefunden." });
            }

            // Statt hartem Löschen (_context.Aufgaben.Remove) setzen is deleted auf 1 
            aufgabe.IsDeleted = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Aufgabe erfolgreich gelöscht." });
        }
        [HttpPut("deleteDienst/{id}")]
        public async Task<IActionResult> SoftDeleteDienst(int id)
        {
            var dienst = await _context.Dienste.FindAsync(id);
            if (dienst == null) return NotFound("Dienst nicht gefunden.");

            dienst.IsDeleted = true; 
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
