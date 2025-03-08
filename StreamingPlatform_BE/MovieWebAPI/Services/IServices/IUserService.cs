﻿using BusinesObjects.Models;
using Microsoft.AspNetCore.OData.Query;
using System.Threading.Tasks;

namespace MovieWebAPI.Services.IServices
{
    public interface IUserService
    {
        Task<AppUser> GetUserFromToken(string token);

        Task<bool> HasRole(AppUser user, string role);


        IQueryable<AppUser> GetAllUsers();
        Task<AppUser> GetUserDetailAsync(string userId);
        Task<bool> UpdateIsActiveAsync(string userId, bool isActive);
    }
}
