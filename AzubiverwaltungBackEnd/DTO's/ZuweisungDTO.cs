namespace AzubiverwaltungBackEnd.DTO_s
{
    public class ZuweisungDto
    {
        public int DienstId { get; set; }
        public int? AzubiId { get; set; }
        public DateTime Datum { get; set; }
        public bool IstFeiertag { get; set; }
    }
}
