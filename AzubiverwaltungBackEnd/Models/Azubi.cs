using System;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AzubiVerwaltungBackEnd.Models
{
    public class Azubi
    {
        [Key] // Markiert die Primärschlüssel-Spalte
        public int UserId { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string passwordhash { get; set; }

        public DateTime CreatedAt { get; set; }

        public bool AdminRights { get; set; }

        public bool isDeleted { get; set; } = false;
       
    }
}
