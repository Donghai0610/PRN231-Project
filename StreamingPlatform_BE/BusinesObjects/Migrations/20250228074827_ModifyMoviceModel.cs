using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BusinesObjects.Migrations
{
    /// <inheritdoc />
    public partial class ModifyMoviceModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7ce7dbb7-50ce-46ad-bfe4-73e12543fda1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c2e5fd40-36d1-4f37-b087-3c9773575325");

            migrationBuilder.AddColumn<string>(
                name: "MovieUrl",
                table: "Movies",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "4d57e662-a62d-41a1-8db6-e89f98b3e144", null, "Admin", "ADMIN" },
                    { "fe3df3be-56aa-4c41-9df9-89ab31da8a03", null, "Customer", "CUSTOMER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4d57e662-a62d-41a1-8db6-e89f98b3e144");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "fe3df3be-56aa-4c41-9df9-89ab31da8a03");

            migrationBuilder.DropColumn(
                name: "MovieUrl",
                table: "Movies");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "7ce7dbb7-50ce-46ad-bfe4-73e12543fda1", null, "Customer", "CUSTOMER" },
                    { "c2e5fd40-36d1-4f37-b087-3c9773575325", null, "Admin", "ADMIN" }
                });
        }
    }
}
