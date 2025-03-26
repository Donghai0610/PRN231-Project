using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BusinesObjects.Migrations
{
    /// <inheritdoc />
    public partial class UpdateRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8944ce89-943e-446c-aef8-01415c538da9");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d6531bbe-4ba1-456e-a172-f3934f87955b");

            migrationBuilder.AlterColumn<string>(
                name: "FullName",
                table: "Actors",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "217eacec-a137-44b7-bd1e-c496b3f91378", null, "Customer", "CUSTOMER" },
                    { "3e041de5-8486-4433-9ef3-12bf3c65c6a8", null, "Admin", "ADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "217eacec-a137-44b7-bd1e-c496b3f91378");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3e041de5-8486-4433-9ef3-12bf3c65c6a8");

            migrationBuilder.AlterColumn<string>(
                name: "FullName",
                table: "Actors",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "8944ce89-943e-446c-aef8-01415c538da9", null, "Customer", "CUSTOMER" },
                    { "d6531bbe-4ba1-456e-a172-f3934f87955b", null, "Admin", "ADMIN" }
                });
        }
    }
}
