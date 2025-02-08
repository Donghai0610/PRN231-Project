namespace MovieWebAPI.Services.IServices
{
    public interface IEmailService
    {
        Task SendRegistrationEmailAsync(string userEmail, string userName, string activationLink);
    }
}
