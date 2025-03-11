import React, { useState, useEffect } from 'react';
import { TextField, Button, Link, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import EditorComponent from './EditorComponent';
import BlogService from '../../../services/blog';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../../services/axios';

const UpdateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [movieId, setMovieId] = useState('');
  const [datePosted, setDatePosted] = useState('');
  const [appUserId, setAppUserId] = useState(null);
  const [movies, setMovies] = useState([]); // Lưu danh sách phim
  const navigate = useNavigate();
  const { id } = useParams();

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

  // Fetch blog data by ID
  const fetchHtmlContent = async (url) => {
    try {
      const response = await fetch(url); // Assuming the URL points to the raw HTML file
      if (response.ok) {
        const htmlContent = await response.text();
        setContent(htmlContent); // Load the content into CKEditor
      } else {
        throw new Error('Failed to fetch HTML content');
      }
    } catch (error) {
      console.error('Error fetching HTML content:', error);
    }
  };

  const fetchBlog = async () => {
    try {
      const response = await BlogService.getBlogById(id);
      setTitle(response.title);
      setMovieId(response.movieId);
      setDatePosted(new Date(response.datePosted).toISOString().slice(0, 16)); // Format for datetime-local input
      fetchHtmlContent(response.content); // Fetch the HTML content and load it into CKEditor
    } catch (error) {
      console.error('Error fetching blog:', error);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const handleEditorChange = (data) => {
    setContent(data);
  };

  const handleSubmit = async () => {
    try {
      if (!title || !content || !movieId) {
        toast.error('Vui lòng điền đầy đủ thông tin');
        return;
      }

      const blogData = {
        title,
        content,
        movieId: parseInt(movieId),
        appUserId,
      };

      // Call the updateBlog function to update the blog
      await BlogService.updateBlog(id, blogData);
      toast.success('Cập nhật bài viết thành công!');

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/admin/blog');
      }, 2000);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật bài viết: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Link href="/admin/blog" style={{ fontSize: '14px', marginBottom: '10px', display: 'inline-block' }}>
        Quản lý Blog &gt; Cập nhật bài blog
      </Link>

      <h2>Cập nhật Bài Viết</h2>

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
      <EditorComponent content={content} setContent={handleEditorChange} />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        style={{ marginTop: '20px' }}
      >
        Cập nhật Bài Viết
      </Button>
    </div>
  );
};

export default UpdateBlog;
