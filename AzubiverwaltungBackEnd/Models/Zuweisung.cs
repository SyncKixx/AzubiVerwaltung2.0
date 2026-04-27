using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AzubiVerwaltungBackEnd.Models
{
    public class Zuweisung
    {
        [Key]
        public int Id { get; set; }
        public int DienstId { get; set; }
        [ForeignKey("DienstId")]
        public Dienst Dienst { get; set; }
        public int? AzubiId { get; set; }
        [ForeignKey("AzubiId")]
        public Azubi Azubi { get; set; }
        public DateTime Datum { get; set; }
        public bool IstFeiertag { get; set; }
    }
}