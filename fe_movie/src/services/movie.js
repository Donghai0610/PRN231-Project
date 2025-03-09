import axiosInstance from "./axios";



const GetAllMovies = async (genreName = null, actorName = null, movieName = null, skip = 0, top = 10) => {
    try {
        // Xây dựng chuỗi filter OData
        let filter = '';
        
        // Thêm bộ lọc thể loại nếu có
        if (genreName) {
            filter += `genres/any(g: g/name eq '${genreName}')`;
        }

        // Thêm bộ lọc tên diễn viên nếu có
        if (actorName) {
            if (filter) filter += ' and '; // Thêm 'and' nếu đã có bộ lọc trước đó
            filter += `actors/any(a: contains(a/name, '${actorName}'))`;
        }

        // Thêm bộ lọc tên phim nếu có
        if (movieName) {
            if (filter) filter += ' and '; // Thêm 'and' nếu đã có bộ lọc trước đó
            filter += `contains(movieName, '${movieName}')`;
        }

        // Xây dựng URL tùy thuộc vào việc có bộ lọc hay không
        let url = '/api/Movies';

        // Nếu có filter, thêm tham số $filter vào URL
        if (filter) {
            url += `?$filter=${filter}`;
        }

        // Thêm tham số phân trang vào URL (Sửa từ $stop thành $top)
        if (!filter) {
            url += `?$skip=${skip}&$top=${top}`;
        } else {
            // Thêm phân trang khi có filter
            url += `&$skip=${skip}&$top=${top}`;
        }

        // Gửi yêu cầu GET sử dụng axiosInstance
        const response = await axiosInstance.get(url);

        return response.data;  // Trả về dữ liệu từ API
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu phim:', error);
        return [];
    }
};

  
  


const GetMovieById = async (id) => {
    try {
      // Gửi yêu cầu GET đến API với ID của phim
      const response = await axiosInstance.get(`/api/Movies/${id}`);
      
      // Trả về dữ liệu phim từ API
      return response.data;
    } catch (error) {
      console.error("Error fetching movie by ID:", error);
      throw error; // Ném lỗi ra ngoài để có thể xử lý tại nơi gọi hàm
    }
  };

const CreateMovie = async (movie) => {
    try {
      const formData = new FormData();
  
      // Append the movie data to formData
      formData.append('MovieName', movie.movieName);
      formData.append('Description', movie.description);
      formData.append('ReleaseDate', movie.releaseDate);
      formData.append('isActive', movie.isActive);
      formData.append('MovieUrl', movie.movieUrl);
  
      // Convert base64 image to File if it's a base64 string
      if (movie.image) {
        const base64Data = movie.image.split(',')[1]; // Remove the data URL prefix
        const byteCharacters = atob(base64Data); // Decode base64 to bytes
        const byteArray = new Uint8Array(byteCharacters.length);
        
        // Convert bytes to an array
        for (let i = 0; i < byteCharacters.length; i++) {
          byteArray[i] = byteCharacters.charCodeAt(i);
        }
  
        // Create a Blob or File object from the byte array
        const blob = new Blob([byteArray], { type: 'image/jpeg' }); // Adjust MIME type accordingly
        const file = new File([blob], 'movie_poster.jpg', { type: 'image/jpeg' });
  
        formData.append('Image', file); // Append the file to the formData
      }
  
      // Append the actor IDs
      movie.actors.forEach(actorId => {
        formData.append('ActorIds', actorId);
      });
  
      // Append the genre IDs
      movie.genres.forEach(genreId => {
        formData.append('GenreIds', genreId);
      });
  
      // Call the API to create the movie
      const response = await axiosInstance.post('/api/Movies', formData);
  
      return response.data;
    } catch (error) {
      console.error("Error creating movie:", error);
      throw error;
    }
  };
  
  const UpdateMovie = async (id, movie) => {
    try {
      const formData = new FormData();
  
      // Append the movie data to formData
      formData.append('MovieId', id);  
      formData.append('MovieName', movie.movieName);
      formData.append('Description', movie.description);
      formData.append('ReleaseDate', movie.releaseDate);
      formData.append('isActive', movie.isActive);
      formData.append('MovieUrl', movie.movieUrl);
  
      // Kiểm tra ảnh, nếu là base64 hoặc URL, xử lý thích hợp
      if (movie.image) {
        let imageToUpload;
  
        // Nếu là base64
        if (movie.image.startsWith('data:image')) {
          const base64Data = movie.image.split(',')[1]; // Loại bỏ tiền tố base64
          const byteCharacters = atob(base64Data); // Giải mã base64 thành bytes
          const byteArray = new Uint8Array(byteCharacters.length);
  
          // Chuyển đổi byteCharacters thành byteArray
          for (let i = 0; i < byteCharacters.length; i++) {
            byteArray[i] = byteCharacters.charCodeAt(i);
          }
  
          // Tạo Blob từ byteArray
          const blob = new Blob([byteArray], { type: 'image/jpeg' }); // Adjust MIME type accordingly
          imageToUpload = new File([blob], 'movie_poster.jpg', { type: 'image/jpeg' });
        } 
        // Nếu là URL, xử lý để lấy tên tệp ảnh từ URL
        else if (movie.image.startsWith('http')) {
          const imageName = movie.image.split('/').pop();  // Lấy tên ảnh từ URL
          const response = await fetch(movie.image);
          const blob = await response.blob(); // Chuyển ảnh URL thành Blob
          imageToUpload = new File([blob], imageName, { type: 'image/jpeg' }); // Đặt tên ảnh từ URL
        }
  
        if (imageToUpload) {
          formData.append('Image', imageToUpload);  // Thêm ảnh vào formData
        }
      } else {
        console.error("No image found for this movie");
      }  
  
      // Append actor IDs
      if (movie.actors && movie.actors.length > 0) {
        movie.actors.forEach(actor => {
          formData.append('ActorIds', actor.id);  // Ensure you're appending actor ID
        });
      }
  
      // Append genre IDs
      if (movie.genres && movie.genres.length > 0) {
        movie.genres.forEach(genre => {
          formData.append('GenreIds', genre.id);  // Ensure you're appending genre ID
        });
      }
  
      // Call the API to update the movie
      const response = await axiosInstance.put(`/api/Movies/${id}`, formData); // PUT để cập nhật
  
      return response.data;  // Trả về dữ liệu phim đã được cập nhật
    } catch (error) {
      console.error("Error updating movie:", error);
      throw error;  // Ném lỗi ra ngoài để có thể xử lý tại nơi gọi hàm
    }
  };
  

  
const DeleteMovie = async (id) => {
    
}

const ActiveMovie = async (id) => {

}

const Movie_Service = {
    GetAllMovies,
    GetMovieById,
    CreateMovie,
    UpdateMovie,
    DeleteMovie,
    ActiveMovie
}
export default Movie_Service;