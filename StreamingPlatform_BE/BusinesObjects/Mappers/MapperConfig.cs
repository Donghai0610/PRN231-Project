using AutoMapper;
using BusinesObjects.Dtos.request;
using BusinesObjects.Dtos.request.Genre;
using BusinesObjects.Dtos.response;
using BusinesObjects.Dtos.response.Genre;
using BusinesObjects.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinesObjects.Mappers
{
    public class MapperConfig : Profile
    {
        public MapperConfig()
        {
            CreateMap<AppUser, RegisterResponseDTO>().ReverseMap();
            CreateMap<AppUser, RegisterRequestDTO>().ReverseMap();

            //Genre
            CreateMap<Genre, GenreResponseDTO>().ReverseMap();
            CreateMap<Genre, NewGenreRequestDTO>().ReverseMap();
            CreateMap<Genre, UpdateGenreRequestDTO>().ReverseMap();



        }

    }
}
