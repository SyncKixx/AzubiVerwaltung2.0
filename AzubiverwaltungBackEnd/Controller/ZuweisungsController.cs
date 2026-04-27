using AzubiverwaltungBackEnd.DTO_s;
using AzubiVerwaltungBackEnd.Data;
using AzubiVerwaltungBackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;


namespace AzubiVerwaltungBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZuweisungController : ControllerBase
    {
        private readonly ApplicationDbContext _context; 

        public ZuweisungController(ApplicationDbContext context)
        {
            _context = context;
        }

        
        [HttpGet("getPlan")]
        public async Task<IActionResult> GetPlan()
        {
            
            var plan = await _context.Zuweisung
                .Include(z => z.Azubi)
                .Include(z => z.Dienst)
                .ToListAsync();

            return Ok(plan);
        }

        
        [HttpPost("saveZuweisung")]
        public async Task<IActionResult> SaveBatch([FromBody] List<ZuweisungDto> dtos)
        {
            if (dtos == null || !dtos.Any()) return BadRequest("Keine Daten empfangen.");

            foreach (var dto in dtos)
            {
            // existiert eintarg?
                var bestehende = await _context.Zuweisung
                .FirstOrDefaultAsync(z => z.DienstId == dto.DienstId && z.Datum.Date == dto.Datum.Date);

                if (bestehende != null) {
                 bestehende.AzubiId = dto.AzubiId;
                 _context.Zuweisung.Update(bestehende);
                }
                else {
                    var neu = new Zuweisung {
                    DienstId = dto.DienstId,
                    AzubiId = dto.AzubiId,
                    Datum = dto.Datum,
                    IstFeiertag = dto.IstFeiertag
                };
                    await _context.Zuweisung.AddAsync(neu);
                }
            }       
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}