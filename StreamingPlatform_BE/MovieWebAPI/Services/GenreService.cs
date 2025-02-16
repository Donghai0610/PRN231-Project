using AutoMapper;
using BusinesObjects.Dtos.request.Genre;
using BusinesObjects.Dtos.response.Genre;
using BusinesObjects.Models;
using MovieWebAPI.Repository;
using MovieWebAPI.Services.IServices;

namespace MovieWebAPI.Services
{
    public class GenreService : IGenreService
    {
        private readonly GenreRepository _genreRepository;
        private readonly IMapper _mapper;

        public GenreService(GenreRepository genreRepository, IMapper mapper)
        {
            _genreRepository = genreRepository;
            _mapper = mapper;
        }

        // Lấy tất cả thể loại
        public async Task<IEnumerable<GenreResponseDTO>> GetAllGenresAsync()
        {
            var genres = await _genreRepository.GetAllGenresAsync();
            return _mapper.Map<IEnumerable<GenreResponseDTO>>(genres);
        }

        // Lấy thể loại theo ID
        public async Task<GenreResponseDTO> GetGenreByIdAsync(int genreId)
        {
            var genre = await _genreRepository.GetGenreByIdAsync(genreId);
            return genre == null ? null : _mapper.Map<GenreResponseDTO>(genre);
        }

        // Thêm thể loại mới
        public async Task<GenreResponseDTO> AddGenreAsync(NewGenreRequestDTO genreDto)
        {
            // Kiểm tra xem genre có tồn tại chưa
            if (!await _genreRepository.IsGenreExistsAsync(genreDto.Name))
            {
                throw new ArgumentException("Genre already exists");
            }
               

            var genre = _mapper.Map<Genre>(genreDto);
            var addedGenre = await _genreRepository.AddGenreAsync(genre);
            return _mapper.Map<GenreResponseDTO>(addedGenre);
        }

        // Cập nhật thể loại
        public async Task<bool> UpdateGenreAsync(UpdateGenreRequestDTO genreDto)

        {
            if (!await _genreRepository.IsGenreExistsAsync(genreDto.Name))
            {
                throw new ArgumentException("Genre already exists");
            }




            var genre = _mapper.Map<Genre>(genreDto);
            return await _genreRepository.UpdateGenreAsync(genre);
        }

        // Xóa thể loại
        public async Task<bool> DeleteGenreAsync(int genreId)
        {
            return await _genreRepository.DeleteGenreAsync(genreId);
        }

        // Kiểm tra thể loại đã tồn tại hay chưa
        public async Task<bool> IsGenreExistsAsync(string genreName)
        {
            return await _genreRepository.IsGenreExistsAsync(genreName);
        }
    }
}
