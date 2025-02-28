
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
            var uploadResult = new ImageUploadResult();

            if (photo.Length > 0)
            {
                await using var stream = photo.OpenReadStream();
                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(photo.Name, stream),
                    Folder = folderName
                };

                uploadResult = _cloudinary.Upload(uploadParams);
            }

            return uploadResult.SecureUrl.ToString();
        }
    }
}
