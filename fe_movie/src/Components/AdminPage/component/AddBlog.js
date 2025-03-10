import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [movieId, setMovieId] = useState('');
  const [datePosted, setDatePosted] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    // Gửi dữ liệu tới API hoặc xử lý thêm vào dữ liệu blog
    console.log('Blog Added:', { title, content, movieId, datePosted });
    navigate('/'); // Sau khi thêm xong, chuyển về trang quản lý blog
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Thêm Bài Viết Mới</h2>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Movie ID"
        value={movieId}
        onChange={(e) => setMovieId(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Date Posted"
        value={datePosted}
        onChange={(e) => setDatePosted(e.target.value)}
        fullWidth
        margin="normal"
        type="datetime-local"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '20px' }}>
        Thêm Bài Viết
      </Button>
    </div>
  );
};

export default AddBlog;
