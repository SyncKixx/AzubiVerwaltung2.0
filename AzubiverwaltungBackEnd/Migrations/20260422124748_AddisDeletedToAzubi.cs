using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AzubiverwaltungBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class AddisDeletedToAzubi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "isDeleted",
                table: "Azubis",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "Azubis",
                keyColumn: "UserId",
                keyValue: 1,
                column: "isDeleted",
                value: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isDeleted",
                table: "Azubis");
        }
    }
}
