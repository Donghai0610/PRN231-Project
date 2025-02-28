using AutoMapper;
using BusinesObjects.Dtos.request.Actor;
using BusinesObjects.Dtos.request.Auth;
using BusinesObjects.Dtos.request.Genre;
using BusinesObjects.Dtos.request.Movie;
using BusinesObjects.Dtos.response.Actor;
using BusinesObjects.Dtos.response.Auth;
using BusinesObjects.Dtos.response.Genre;
using BusinesObjects.Dtos.response.Movie;
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

            //Actor
            CreateMap<AddActorRequestDTO,Actor>().ForMember(dest => dest.Image,opt => opt.Ignore()).ReverseMap();
            CreateMap<Actor, UpdateActorRequestDTO>().ReverseMap();

            CreateMap<Actor, ActorResponseDTO>().ReverseMap();


            //Movie
            // Movie Mapping
            CreateMap<AddMovieRequestDTO, Movie>()
                .ForMember(dest => dest.MovieGenres, opt => opt.Ignore())  // Bỏ qua ánh xạ MovieGenres
                .ForMember(dest => dest.MovieActors, opt => opt.Ignore())  // Bỏ qua ánh xạ MovieActors
                .ForMember(dest => dest.Image, opt => opt.Ignore())  // Bỏ qua trường Image (được xử lý riêng biệt)
                .ReverseMap();

            CreateMap<UpdateMovieRequestDTO, Movie>()
                .ForMember(dest => dest.MovieGenres, opt => opt.Ignore())  // Bỏ qua ánh xạ MovieGenres
                .ForMember(dest => dest.MovieActors, opt => opt.Ignore())  // Bỏ qua ánh xạ MovieActors
                .ForMember(dest => dest.Image, opt => opt.Ignore())  // Bỏ qua trường Image (được xử lý riêng biệt)
                .ReverseMap();

            CreateMap<Movie, MovieResponseDTO>()
                .ForMember(dest => dest.Actors, opt => opt.MapFrom(src => src.MovieActors))
                .ForMember(dest => dest.Genres, opt => opt.MapFrom(src => src.MovieGenres))
                .ForMember(dest => dest.Comments, opt => opt.MapFrom(src => src.Comments))
                .ForMember(dest => dest.Reviews, opt => opt.MapFrom(src => src.Reviews))
                .ReverseMap();

        }

    }
}
