using AutoMapper;
using BusinesObjects;
using BusinesObjects.Mappers;
using BusinesObjects.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.OData;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OData.ModelBuilder;
using MovieWebAPI.Exceptions;
using MovieWebAPI.Helpers;
using MovieWebAPI.Repository;
using MovieWebAPI.Services;
using MovieWebAPI.Services.IServices;

var builder = WebApplication.CreateBuilder(args);
var mapperConfig = new MapperConfiguration( mc => mc.AddProfile(new MapperConfig()));
IMapper mapper = mapperConfig.CreateMapper();
builder.Services.AddSingleton(mapper);

var modelBuilder = new ODataConventionModelBuilder();
modelBuilder.EntitySet<Movie>("Movies");
modelBuilder.EntitySet<Blog>("Blog");
modelBuilder.EntitySet<AppUser>("AppUser");
modelBuilder.EntitySet<Genre>("Genre");

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



builder.Services.AddDbContext<ApplicationDBContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});


builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 8;
    options.User.RequireUniqueEmail = true;


}).AddEntityFrameworkStores<ApplicationDBContext>()
.AddDefaultTokenProviders();

builder.Services.AddControllers()
    .AddOData(options =>                                                                
        options.Select()
               .Filter()
               .OrderBy()
               .Count() 
               .Expand()
               .SetMaxTop(100)
               .AddRouteComponents("api", modelBuilder.GetEdmModel()));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
    options.DefaultChallengeScheme =
    options.DefaultForbidScheme =
    options.DefaultScheme =
    options.DefaultSignInScheme =
    options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;

}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JWT:Audience"],
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            System.Text.Encoding.UTF8.GetBytes(builder.Configuration["JWT:SigningKey"])
        )
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
    options.AddPolicy("Customer", policy => policy.RequireRole("Customer"));
    options.AddPolicy("AdminOrCustomer", policy =>
       policy.RequireRole("Admin", "Customer"));

});
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 10 * 1024 * 1024;
});


builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IEmailService,EmailService>();
builder.Services.AddScoped<IGenreService,GenreService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IActorService, ActorService>();
builder.Services.AddScoped<ICloudinaryService, CloudinaryService>();
builder.Services.AddScoped<IMovieService, MovieService>();
builder.Services.AddScoped<IBlogService, BlogService>();
builder.Services.AddScoped<BlogRepository>();
builder.Services.AddScoped<MovieRepository>();
builder.Services.AddScoped<ActorRepository>();
builder.Services.AddScoped<GenreRepository>();
builder.Services.AddScoped<UserRepository>();

builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));
builder.Services.Configure<EmailTemplates>(builder.Configuration.GetSection("EmailTemplates"));
builder.Services.AddExceptionHandler<GlobalExceptionHanlder>();
builder.Services.AddProblemDetails();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors(x => x.AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
                .WithOrigins("http://localhost:3000")
                .SetIsOriginAllowed(origin => true));
app.UseExceptionHandler();

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.MapControllers();

app.Run();
