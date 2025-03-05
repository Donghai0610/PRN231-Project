
using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using MovieWebAPI.Helpers;
using MovieWebAPI.Services.IServices;

namespace MovieWebAPI.Services

{
    public class CloudinaryService : ICloudinaryService
    {
        private readonly IConfiguration _configuration;
        private readonly CloudinarySettings _settings;
        private readonly Cloudinary _cloudinary;
        public CloudinaryService(IConfiguration configuration)
        {
            _configuration = configuration;
            _settings = _configuration.GetSection("CloudinarySettings").Get<CloudinarySettings>();
            Account account = new Account(
                _settings.CloudName,
                _settings.ApiKey,
                _settings.ApiSecret);

            _cloudinary = new Cloudinary(account);
        }
        public async Task<string> UploadPhoto(IFormFile photo, string folderName)
        {
            if (photo == null || photo.Length == 0)
            {
                throw new ArgumentException("Invalid photo file");
            }

            var uploadResult = new ImageUploadResult();

            await using var stream = photo.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(photo.FileName, stream),
                Folder = folderName
            };

            uploadResult = _cloudinary.Upload(uploadParams);

            if (uploadResult.Error != null)
            {
                throw new Exception($"Cloudinary upload error: {uploadResult.Error.Message}");
            }

            return uploadResult.SecureUrl?.ToString() ?? throw new Exception("Upload failed: SecureUrl is null");
        }


        public async Task<string> UploadHTML(IFormFile htmlFile, string folderName)
        {
            if (htmlFile == null || htmlFile.Length == 0)
            {
                throw new ArgumentException("Invalid HTML file");
            }

            // Tạo đối tượng RawUploadParams mà không cần thiết phải gán ResourceType
            var uploadParams = new RawUploadParams()
            {
                File = new FileDescription(htmlFile.FileName, htmlFile.OpenReadStream()),
                Folder = folderName,
            };

            // Tải file lên Cloudinary
            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
            {
                throw new Exception($"Cloudinary upload error: {uploadResult.Error.Message}");
            }

            // Trả về URL của file HTML đã tải lên
            return uploadResult.SecureUrl?.ToString() ?? throw new Exception("Upload failed: SecureUrl is null");
        }

    }
}
