import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip } from '@mui/material';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([
    {
      blogId: 1,
      title: "Review phim tóm tắt dành cho 'người lười'",
      content: "https://example.com/content1",
      movieId: 3,
      datePosted: "2025-03-02T17:03:35.2626323",
    },
    {
      blogId: 2,
      title: "Diễn Viên Châu Tinh Trì quay lại đóng phim",
      content: "https://example.com/content2",
      movieId: 6,
      datePosted: "2025-03-02T19:24:30.8308053",
    },
  ]);

  const navigate = useNavigate();

  const handleUpdate = (blogId) => {
    // Chuyển đến trang update (có thể sử dụng state hoặc params để chỉ rõ blogId)
    navigate(`/update/${blogId}`);
  };

  const handleDelete = (blogId) => {
    // Xóa blog từ dữ liệu (có thể gọi API)
    setBlogs(blogs.filter((blog) => blog.blogId !== blogId));
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/add-blog')} // Điều hướng đến màn hình tạo mới bài viết
        style={{ marginBottom: '20px' }}
      >
        Thêm Bài Viết Mới
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Blog ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Movie ID</TableCell>
              <TableCell>Date Posted</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog.blogId}>
                <TableCell>{blog.blogId}</TableCell>
                <TableCell>{blog.title}</TableCell>
                <TableCell>
                  <a href={blog.content} target="_blank" rel="noopener noreferrer">Xem nội dung</a>
                </TableCell>
                <TableCell>{blog.movieId}</TableCell>
                <TableCell>{new Date(blog.datePosted).toLocaleString()}</TableCell>
                <TableCell>
                  <Tooltip title="Update">
                    <IconButton color="warning" onClick={() => handleUpdate(blog.blogId)}>
                      <FaEdit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDelete(blog.blogId)}>
                      <FaTrashAlt />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BlogManagement;
