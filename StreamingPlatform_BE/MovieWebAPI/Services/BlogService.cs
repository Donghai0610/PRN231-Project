using AutoMapper;
using BusinesObjects.Dtos.request.Blog;
using BusinesObjects.Dtos.response.Blog;
using BusinesObjects.Models;
using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using MovieWebAPI.Repository;
using MovieWebAPI.Services.IServices;

namespace MovieWebAPI.Services
{
    public class BlogService : IBlogService
    {
        private readonly BlogRepository _blogRepository;
        private readonly IMapper _mapper;
        private readonly ICloudinaryService _cloudinaryService;

        public BlogService(BlogRepository blogRepository, IMapper mapper, ICloudinaryService cloudinaryService)
        {
            _blogRepository = blogRepository;
            _mapper = mapper;
            _cloudinaryService = cloudinaryService;
        }

        // Create Blog
        public async Task<BlogResponseDTO> CreateBlogAsync(BlogRequestDTO request)
        {

            var blog = _mapper.Map<Blog>(request);
            blog.DatePosted = DateTime.Now;
            // If content has a file, upload it to Cloudinary and get the URL
            if (request.Content != null)
            {
                var uploadResult = await UploadFileToCloudinary(request.Content, request.Title);
                blog.Content = uploadResult.ToString();  // Save Cloudinary URL of the file
            }

            var createdBlog = await _blogRepository.CreateAsync(blog);
            return _mapper.Map<BlogResponseDTO>(createdBlog);
        }

        // Get all Blogs
        public async Task<List<BlogResponseDTO>> GetAllBlogsAsync()
        {
            var blogs = await _blogRepository.GetAllAsync();
            return _mapper.Map<List<BlogResponseDTO>>(blogs);
        }

        // Get Blog by Id
        public async Task<BlogResponseDTO> GetBlogByIdAsync(int id)
        {
            var blog = await _blogRepository.GetByIdAsync(id);
            return _mapper.Map<BlogResponseDTO>(blog);
        }

        // Update Blog
        public async Task<BlogResponseDTO> UpdateBlogAsync(int id, UpdateBlogRequestDTO request)
        {
            // Kiểm tra nếu Blog không tồn tại
            var existingBlog = await _blogRepository.GetByIdAsync(id);
            if (existingBlog == null) return null;

            if (existingBlog.BlogId != request.BlogId)
            {
                return null;  
            }

            // Ánh xạ các trường từ DTO vào Blog entity
            _mapper.Map(request, existingBlog);
            existingBlog.DatePosted = DateTime.UtcNow;

            // Nếu có file nội dung (Content), tải lên Cloudinary
            if (request.Content != null)
            {
                var uploadResult = await UploadFileToCloudinary(request.Content, request.Title);
                existingBlog.Content = uploadResult.ToString();  // Lưu URL của file vào Content
            }

            var updatedBlog = await _blogRepository.UpdateAsync(existingBlog);
            return _mapper.Map<BlogResponseDTO>(updatedBlog);
        }
        // Delete Blog
        public async Task<bool> DeleteBlogAsync(int id)
        {
            return await _blogRepository.DeleteAsync(id);
        }

        // Helper method to upload a file to Cloudinary and get the URL
        private async Task<string> UploadFileToCloudinary(IFormFile file, string blogTitle)
        {
            var folderPath = $"blog/{blogTitle}";  // Use the blog title as part of the folder path in Cloudinary

            // Use CloudinaryService to upload the file
            return await _cloudinaryService.UploadHTML(file, folderPath);  // Assuming UploadPhoto returns the URL of the uploaded file
        }
    }
}

