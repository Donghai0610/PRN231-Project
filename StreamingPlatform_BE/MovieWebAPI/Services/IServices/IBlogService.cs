using BusinesObjects.Dtos.request.Blog;
using BusinesObjects.Dtos.response.Blog;

namespace MovieWebAPI.Services.IServices
{
    public interface IBlogService
    {
        Task<BlogResponseDTO> CreateBlogAsync(BlogRequestDTO request);
        Task<List<BlogResponseDTO>> GetAllBlogsAsync();
        Task<BlogResponseDTO> GetBlogByIdAsync(int id);
        Task<BlogResponseDTO> UpdateBlogAsync(int blogId, UpdateBlogRequestDTO request);
        Task<bool> DeleteBlogAsync(int id);
    }
}
