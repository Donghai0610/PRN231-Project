using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BusinesObjects.Migrations
{
    /// <inheritdoc />
    public partial class SeedRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0c10cc20-d8e1-411c-a796-06461e9646e2");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "19fc05d5-2010-4694-ac00-d888fa0ff2a6");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "4620ea02-53f1-4c71-be41-fe76d684721f", null, "Admin", "ADMIN" },
                    { "c7531c34-e8d2-439a-b744-da40886cb135", null, "Customer", "CUSTOMER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4620ea02-53f1-4c71-be41-fe76d684721f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c7531c34-e8d2-439a-b744-da40886cb135");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "0c10cc20-d8e1-411c-a796-06461e9646e2", null, "Customer", "CUSTOMER" },
                    { "19fc05d5-2010-4694-ac00-d888fa0ff2a6", null, "Admin", "ADMIN" }
                });
        }
    }
}
