using System.ComponentModel.DataAnnotations;

namespace AzubiVerwaltungBackEnd.Models
{
    public class Dienst
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Bezeichnung { get; set; }
        public string Beschreibung {  get; set; }
        [Required]
        public IntervallEnum Intervall { get; set; }
        public string Wochentage { get; set; }
        public string Icon { get; set; } = string.Empty;
        public bool IsDeleted { get; set; } = false;
    }
}
