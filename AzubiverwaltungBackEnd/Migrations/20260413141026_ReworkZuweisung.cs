using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AzubiverwaltungBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class ReworkZuweisung : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AufgabeId",
                table: "Zuweisung",
                newName: "DienstId");

            migrationBuilder.CreateIndex(
                name: "IX_Zuweisung_AzubiId",
                table: "Zuweisung",
                column: "AzubiId");

            migrationBuilder.CreateIndex(
                name: "IX_Zuweisung_DienstId",
                table: "Zuweisung",
                column: "DienstId");

            migrationBuilder.AddForeignKey(
                name: "FK_Zuweisung_Azubis_AzubiId",
                table: "Zuweisung",
                column: "AzubiId",
                principalTable: "Azubis",
                principalColumn: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Zuweisung_Dienste_DienstId",
                table: "Zuweisung",
                column: "DienstId",
                principalTable: "Dienste",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Zuweisung_Azubis_AzubiId",
                table: "Zuweisung");

            migrationBuilder.DropForeignKey(
                name: "FK_Zuweisung_Dienste_DienstId",
                table: "Zuweisung");

            migrationBuilder.DropIndex(
                name: "IX_Zuweisung_AzubiId",
                table: "Zuweisung");

            migrationBuilder.DropIndex(
                name: "IX_Zuweisung_DienstId",
                table: "Zuweisung");

            migrationBuilder.RenameColumn(
                name: "DienstId",
                table: "Zuweisung",
                newName: "AufgabeId");
        }
    }
}
