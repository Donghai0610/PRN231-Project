using Microsoft.Extensions.Options;
using MovieWebAPI.Helpers;
using MovieWebAPI.Services.IServices;
using System.Net.Mail;
using System.Net;

namespace MovieWebAPI.Services
{
    public class EmailService : IEmailService
    {
        private readonly SmtpSettings _smtpSettings;
        private readonly EmailTemplates _emailTemplates;

        // Nhận cấu hình SMTP và EmailTemplates qua DI
        public EmailService(IOptions<SmtpSettings> smtpSettings, IOptions<EmailTemplates> emailTemplates)
        {
            _smtpSettings = smtpSettings.Value;
            _emailTemplates = emailTemplates.Value;
        }

        public async Task SendForgotPasswordEmailAsync(string userEmail, string userName, string resetLink)
        {
            var subject = "Password Reset Request";
            var body = $"Hello {userName},\n\n" +
                       "You requested to reset your password. Please click the link below to reset your password:\n" +
                       $"{resetLink}\n\n" +
                       "If you did not request a password reset, please ignore this email.";

            // Gửi email qua SMTP
            await SendEmailAsync(userEmail, subject, body);
        }

        public async Task SendRegistrationEmailAsync(string userEmail, string userName, string activationLink)
        {
            // Lấy cấu hình từ EmailTemplates
            var subject = _emailTemplates.RegistrationSubject;
            var body = _emailTemplates.RegistrationBody.Replace("{UserName}", userName).Replace("{ActivationLink}", activationLink);

            try
            {
                // Gửi email trong một thread riêng biệt (bất đồng bộ)
                await Task.Run(() =>
                {
                    using var client = new SmtpClient(_smtpSettings.SmtpServer)
                    {
                        Port = _smtpSettings.Port,
                        Credentials = new NetworkCredential(_smtpSettings.UserName, _smtpSettings.Password),
                        EnableSsl = true
                    };

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(_smtpSettings.FromEmail),
                        Subject = subject,
                        Body = body,
                        IsBodyHtml = false
                    };

                    mailMessage.To.Add(userEmail);

                    Console.WriteLine($"Attempting to send email to {userEmail} with subject: {subject}");

                    // Gửi email đồng bộ trong thread riêng biệt
                    client.Send(mailMessage);

                    Console.WriteLine("Email sent successfully.");
                });
            }
            catch (SmtpException smtpEx)
            {
                // Log lỗi gửi email nếu có (SMTP-related errors)
                Console.WriteLine($"SMTP error: {smtpEx.Message}");
            }
            catch (Exception ex)
            {
                // Log lỗi chung nếu có
                Console.WriteLine($"Error sending email: {ex.Message}");
            }
        }

        public async Task SendEmailAsync(string email, string subject, string message)
        {
            using var client = new SmtpClient(_smtpSettings.SmtpServer)
            {
                Port = _smtpSettings.Port,
                Credentials = new NetworkCredential(_smtpSettings.UserName, _smtpSettings.Password),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_smtpSettings.FromEmail),
                Subject = subject,
                Body = message,
                IsBodyHtml = false
            };

            mailMessage.To.Add(email);

            await client.SendMailAsync(mailMessage);
        }

    }
}
