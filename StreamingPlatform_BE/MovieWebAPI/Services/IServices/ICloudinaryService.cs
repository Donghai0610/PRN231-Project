namespace MovieWebAPI.Services.IServices
{
    public interface ICloudinaryService
    {
        Task<string> UploadPhoto(IFormFile photo, string folderName);
    }
}
