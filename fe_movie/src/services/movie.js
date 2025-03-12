import axiosInstance from "./axios";



const GetAllMovies = async (genreName = null, actorName = null, movieName = null, skip = 0, top = 5) => {
    try {
        let filter = '';
        
        if (genreName) {
          if (filter) filter += ' and '; 
            filter += `genres/any(g: g/name eq '${genreName}')`;
        }

        if (actorName) {
            if (filter) filter += ' and '; 
            filter += `actors/any(a: contains(a/fullname, '${actorName}'))`;
        }

        if (movieName) {
          if (filter) filter += ' and '; 
            filter += `contains(movieName, '${movieName}')`;
        }

        let url = '/api/Movies';

        if (filter) {
            url += `?$filter=${filter}`;
        }

        if (!filter) {
            url += `?$skip=${skip}&$top=${top}`;
        } else {
            // Thêm phân trang khi có filter
            url += `&$skip=${skip}&$top=${top}`;
        }

        const response = await axiosInstance.get(url);

        return response;  
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
      movie.actors.forEach(actorId => {
        formData.append('ActorIds', actorId);
      });
  
      // Append genre IDs
      movie.genres.forEach(genreId => {
        formData.append('GenreIds', genreId);
      });
  
      // Call the API to update the movie
      const response = await axiosInstance.put(`/api/Movies/${id}`, formData); // PUT để cập nhật
  
      return response.data;  // Trả về dữ liệu phim đã được cập nhật
    } catch (error) {
      console.error("Error updating movie:", error);
      throw error;  // Ném lỗi ra ngoài để có thể xử lý tại nơi gọi hàm
    }
  };
  

  
  const DeleteMovie = async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/Movies/${id}`);
  
      if (response.status === 200) {
        console.log("Phim đã được xóa thành công!");
        return response.data; 
      } else {
        console.error("Xóa phim không thành công:", response);
        throw new Error("Không thể xóa phim");
      }
    } catch (error) {
      console.error("Lỗi khi xóa phim:", error);
          throw error; 
    }
  };
  

  const ActiveMovie = async (id) => {
    try {
      const response = await axiosInstance.put(`/api/Movies/${id}/activate`,
        true,
      );
      return response.data;  
    } catch (error) {
      console.error("Error updating movie status:", error);
      throw error; 
    }
  };
  
const GetMovieTop4 = async () => {
  try {
    const response = await axiosInstance.get('/api/Movies?top=4&skip=6&$filter=isActive eq true');
    return response.data;
  } catch (error) {
    console.error("Error fetching top 4 movies:", error);
    throw error;
  }
};

const GetMovieHot = async () => {
  try {
    const response = await axiosInstance.get('/api/Movies?top=8&skip=1&$filter=isActive eq true');
    return response.data;
  } catch (error) {
    console.error("Error fetching top 4 movies:", error);
    throw error;
  }
}
const GetMovieRelsease = async () => {
  try {
    const response = await axiosInstance.get('/api/Movies?top=8&skip=0&$filter=isActive eq false');
    return response.data;
  } catch (error) {
    console.error("Error fetching top 4 movies:", error);
    throw error;
  }
}


const GetAllMoviesForUser = async (genreName = null, actorName = null, movieName = null, releaseYear = null, skip = 0, top = 5) => {
    try {
        let filters = [];
        
        // Thêm điều kiện isActive
        filters.push('isActive eq true');

        // Thêm filter cho genre nếu có
        if (genreName) {
            filters.push(`genres/any(g: g/name eq '${genreName}')`);
        }

        // Thêm filter cho actor nếu có
        if (actorName) {
            filters.push(`actors/any(a: contains(a/fullname, '${actorName}'))`);
        }

        // Thêm filter cho tên phim nếu có
        if (movieName) {
            filters.push(`contains(movieName, '${movieName}')`);
        }

        // Thêm filter cho năm phát hành nếu có
        if (releaseYear) {
            filters.push(`year(releaseDate) eq ${releaseYear}`);
        }

        // Tạo URL với các filter
        let url = '/api/Movies?';
        
        // Thêm điều kiện filter nếu có
        if (filters.length > 0) {
            url += `$filter=${filters.join(' and ')}`;
        }

        // Thêm phân trang
        url += `${filters.length > 0 ? '&' : ''}$skip=${skip}&$top=${top}`;

        const response = await axiosInstance.get(url);
        return response;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu phim:', error);
        return { data: [] };
    }
};




const Movie_Service = {
    GetAllMovies,
    GetMovieById,
    CreateMovie,
    UpdateMovie,
    DeleteMovie,
    ActiveMovie,
    GetMovieTop4,
    GetMovieHot,
    GetMovieRelsease,
    GetAllMoviesForUser,
}
export default Movie_Service;