namespace MovieWebAPI.Services.IServices
{
    public interface IEmailService
    {
        Task SendRegistrationEmailAsync(string userEmail, string userName, string activationLink);

        Task SendForgotPasswordEmailAsync(string userEmail, string userName, string resetLink);
        Task SendEmailAsync(string email, string subject, string message);
    }
}
