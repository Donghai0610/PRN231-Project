# 🎬 Hi-Movie - Streaming Movie Website

Hi-Movie is an online movie streaming platform with full content and user management features, built using **C# .NET Web API** for the backend and **ReactJS** for the frontend.

---

## 🚀 Main Features

- ✅ **CRUD Movie**: Create, read, update, delete movie information.
- ✅ **CRUD Actor**: Manage actors, their details, and photos.
- ✅ **CRUD Genre**: Manage movie genres.
- ✅ **CRUD Blog**: Create and manage blog posts about movies.
- ✅ **CRUD User**: Manage user accounts.
- ✅ **Image & Video Upload** via Cloudinary.
- ✅ **Email Sending** for account confirmation/password recovery using Mail Sender.
- ✅ User roles (Admin, Editor, Viewer).
- ✅ Movie search and filtering by title, genre, actor.
- ✅ Responsive UI optimized for both desktop and mobile.

---

## 🧰 Tech Stack

### 📌 Backend (.NET 7 / .NET 6)
- ASP.NET Core Web API
- Entity Framework Core (Code First)
- SQL Server
- Cloudinary SDK (for image and video upload)
- MailKit or SendGrid (Mail Sender)
- JWT Authentication
- AutoMapper
- Swagger (API Documentation)

### 💻 Frontend (ReactJS)
- React 18+
- Axios (API calls)
- React Router
- Redux Toolkit (state management)
- Formik + Yup (form validation)
- TailwindCSS / Bootstrap

---

## 📦 Installation & Run Instructions

### Backend
```bash
cd HiMovie.API
dotnet restore
dotnet ef database update
dotnet run

🔧 Environment Configuration
Create a .env file for both projects:

🔑 Backend (HiMovie.API/.env)
ini
Sao chép
Chỉnh sửa
ConnectionStrings__DefaultConnection=your_sql_connection
Cloudinary__CloudName=your_cloud_name
Cloudinary__ApiKey=your_api_key
Cloudinary__ApiSecret=your_api_secret
MailSettings__Email=your_email
MailSettings__Password=your_email_password
Jwt__Key=your_jwt_secret
🌐 Frontend (hi-movie-client/.env)


If you want to contribute or encounter any issues, please create an issue or contact via email: nguyenonghai2@gmail.com



