using AutoMapper;
using BusinesObjects.Dtos;
using BusinesObjects.Dtos.request.Actor;
using BusinesObjects.Dtos.response.Actor;
using BusinesObjects.Models;
using MovieWebAPI.Repository;
using MovieWebAPI.Services.IServices;

namespace MovieWebAPI.Services
{
    public class ActorService : IActorService
    {
        private readonly ActorRepository _actorRepository;
        private readonly IMapper _mapper;
        private readonly ICloudinaryService _cloudinaryService;
        public ActorService(ActorRepository actorRepository, IMapper mapper, ICloudinaryService cloudinaryService)
        {
            _actorRepository = actorRepository;
            _mapper = mapper;
            _cloudinaryService = cloudinaryService;
        }
        public async Task<PagedResponse<ActorResponseDTO>> GetAllActorsAsync(UrlQueryParameters queryParameters)
        {
            // Tìm kiếm và phân trang trong service
            var actors = await _actorRepository.GetAllActorsAsync();

            // Áp dụng tìm kiếm nếu có
            if (!string.IsNullOrEmpty(queryParameters.Search))
            {
                actors = actors.Where(a => a.FullName.Contains(queryParameters.Search, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            // Phân trang
            var totalItems = actors.Count();
            var totalPages = (int)Math.Ceiling(totalItems / (double)queryParameters.PageSize);
            var pagedActors = actors.Skip((queryParameters.Page - 1) * queryParameters.PageSize).Take(queryParameters.PageSize).ToList();

            // Ánh xạ Actor sang ActorResponseDTO
            var actorResponseDTOs = _mapper.Map<List<ActorResponseDTO>>(pagedActors);

            // Trả về kết quả phân trang
            return new PagedResponse<ActorResponseDTO>(
                actorResponseDTOs,
                totalPages,
                queryParameters.Page,
                queryParameters.PageSize,
                totalItems
            );
        }

        public async Task<ActorResponseDTO> GetActorByIdAsync(int actorId)
        {
            var actor = await _actorRepository.GetActorByIdAsync(actorId);
            return _mapper.Map<ActorResponseDTO>(actor);
        }

        public async Task<ActorResponseDTO> AddActorAsync(AddActorRequestDTO actorDto, IFormFile photo)
        {
            if (await _actorRepository.IsActorExistsAsync(actorDto.FullName))
            {
                throw new ArgumentException("Actor already exists.");
            }

            var actor = _mapper.Map<Actor>(actorDto);

            // Kiểm tra xem ảnh có được gửi không trước khi upload
            if (photo != null)
            {
                var uploadResult = await _cloudinaryService.UploadPhoto(photo, $"actor/{actor.FullName}");
                actor.Image = uploadResult.ToString();
            }

            var addedActor = await _actorRepository.AddActorAsync(actor);
            return _mapper.Map<ActorResponseDTO>(addedActor);
        }


        public async Task<bool> UpdateActorAsync(UpdateActorRequestDTO actorDto)
        {
            var actor = _mapper.Map<Actor>(actorDto);
            return await _actorRepository.UpdateActorAsync(actor);
        }

        public async Task<bool> DeleteActorAsync(int actorId)
        {
            return await _actorRepository.DeleteActorAsync(actorId);
        }
    }
}
