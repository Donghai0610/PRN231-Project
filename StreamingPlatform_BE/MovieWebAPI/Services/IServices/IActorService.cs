using BusinesObjects.Dtos.response.Actor;
using BusinesObjects.Dtos;
using BusinesObjects.Dtos.request.Actor;

namespace MovieWebAPI.Services.IServices
{
    public interface IActorService
    {
        Task<PagedResponse<ActorResponseDTO>> GetAllActorsAsync(UrlQueryParameters queryParameters);
        Task<ActorResponseDTO> GetActorByIdAsync(int actorId);
        Task<ActorResponseDTO> AddActorAsync(AddActorRequestDTO actorDto,IFormFile photo);

        Task<bool> UpdateActorAsync(UpdateActorRequestDTO actorDto);
        Task<bool> DeleteActorAsync(int actorId);


    }
}
