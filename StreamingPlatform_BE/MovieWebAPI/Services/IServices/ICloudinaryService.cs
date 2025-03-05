namespace MovieWebAPI.Services.IServices
{
    public interface ICloudinaryService
    {
        Task<string> UploadPhoto(IFormFile photo, string folderName);
        Task<string> UploadHTML(IFormFile htmlFile, string folderName);
    }
}
