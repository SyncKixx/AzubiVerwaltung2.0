using AzubiVerwaltungBackEnd.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AzubiVerwaltungBackEnd.Models;

namespace AzubiVerwaltungBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnalyseController : ControllerBase
    {
        private readonly ApplicationDbContext _context; // Deinen Kontext-Namen hier eintragen

        public AnalyseController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("getAnalyse")]
        public async Task<IActionResult> GetStatistik()
        {
            var stats = await _context.Zuweisung
         .Include(z => z.Azubi)
         .Include(z => z.Dienst)
         .Where(z => z.AzubiId != null)
         // azubis gruppieren 
         .GroupBy(z => new { z.Azubi.FirstName, z.Azubi.LastName })
         .Select(azubiGruppe => new
         {
             AzubiName = azubiGruppe.Key.FirstName + " " + azubiGruppe.Key.LastName,
             //In Azubis grupieren nach dem Dienst
             AufgabenAufteilung = azubiGruppe
                 .GroupBy(z => z.Dienst.Bezeichnung)
                 .Select(dienstGruppe => new
                 {
                     DienstName = dienstGruppe.Key,
                     Anzahl = dienstGruppe.Count()
                 }).ToList(),
             GesamtAnzahl = azubiGruppe.Count()
         })
         .OrderBy(s => s.AzubiName)
         .ToListAsync();

            return Ok(stats);
        }
    }
}