import React, { useState, useEffect } from 'react';
import { TextField, Button, Link, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditorComponent from './EditorComponent';
import BlogService from '../../../services/blog';
import MovieService from '../../../services/movie';  // Đảm bảo có một MovieService để gọi API Movies
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../../services/axios';
const AddBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [movieId, setMovieId] = useState('');
  const [datePosted, setDatePosted] = useState('');
  const [appUserId, setAppUserId] = useState(null);
  const [movies, setMovies] = useState([]); // Lưu danh sách phim
  const navigate = useNavigate();

  // Giải mã token và lấy appUserId
  useEffect(() => {
    const token = localStorage.getItem('token'); 
    if (token) {
      const decodedToken = jwtDecode(token);
      setAppUserId(decodedToken.nameid);
    }
  }, []);

  // Lấy danh sách phim từ API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axiosInstance.get('/api/Movies'); // Call API lấy danh sách phim
        setMovies(response.data); // Lưu vào state
      } catch (error) {
        console.error('Error fetching movies:', error);
        toast.error('Không thể lấy danh sách phim');
      }
    };

    fetchMovies();
  }, []);

  const handleEditorChange = (data) => {
    setContent(data);
    console.log("Editor content:", data);
  };

  const handleSubmit = async () => {
    try {
      if (!title || !content || !movieId) {
        toast.error('Vui lòng điền đầy đủ thông tin');
        return;
      }

      console.log("Content being sent:", content);

      const blogData = {
        title,
        content,
        movieId: parseInt(movieId), // Dùng movieId từ dropdown
        appUserId,
      };

      await BlogService.createBlog(blogData);
      toast.success('Thêm bài viết thành công!');

      // Chuyển hướng sau 2 giây
      setTimeout(() => {
        navigate('/admin/blog');
      }, 2000);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm bài viết: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Link href="/admin/blog" style={{ fontSize: '14px', marginBottom: '10px', display: 'inline-block' }}>
        Quản lý Blog  &gt; Thêm bài blog
      </Link>

      <h2>Thêm Bài Viết Mới</h2>

      <TextField
        label="Tiêu đề"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
        required
      />

      <FormControl fullWidth margin="normal" required>
        <InputLabel>Chọn Phim</InputLabel>
        <Select
          value={movieId}
          onChange={(e) => setMovieId(e.target.value)}
        >
          {movies.map((movie) => (
            <MenuItem key={movie.movieId} value={movie.movieId}>
              {movie.movieName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Ngày đăng"
        value={datePosted}
        onChange={(e) => setDatePosted(e.target.value)}
        fullWidth
        margin="normal"
        type="datetime-local"
        InputLabelProps={{
          shrink: true,
        }}
      />

        
      {/* CKEditor for Content */}
      <div className="editor-container-wrapper">
        <EditorComponent content={content} setContent={handleEditorChange} />
      </div>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        style={{ marginTop: '20px' }}
      >
        Thêm Bài Viết
      </Button>
    </div>
  );
};

export default AddBlog;
