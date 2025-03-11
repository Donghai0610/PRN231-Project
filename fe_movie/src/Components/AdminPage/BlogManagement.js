import React, { useState, useEffect } from 'react';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, Stack, Pagination, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { FaEdit, FaPlus, FaSearchDollar, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import BlogService from '../../services/blog';
import axiosInstance from '../../services/axios';
import Swal from 'sweetalert2';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const blogsPerPage = 10;
  const [open, setOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState('');
  const navigate = useNavigate();

  const fetchBlogs = async (filter = '', skip = 0, top = blogsPerPage) => {
    try {
      // Check if filter is empty and assign a default valid filter
  
      const totalItems = await axiosInstance.get('/api/Blog');
      setTotalCount(totalItems.data.length);

  
      const data = await BlogService.getBlogs(filter, skip, top);
      setBlogs(data);  
      setTotalPages(Math.ceil(totalItems.data.length/ blogsPerPage));  

      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleUpdate = (blogId) => {
    navigate(`/admin/update-blog/${blogId}`);
  };

  const handleDelete = (blogId) => {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa bài viết này ?',
      text: 'Bạn không thể hoàn tác sau khi xóa!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý',
      cancelButtonText  : 'Hủy bỏ'
    }).then((result) => {
      if (result.isConfirmed) {
        BlogService.deleteBlog(blogId)
        .then(() => {
          setBlogs(blogs.filter((blog) => blog.blogId !== blogId));
        })
        .catch((error) => console.error('Error deleting blog:', error));
        Swal.fire(
          'Đã xóa bài viết!',
          'Bài viết đã được xóa thành công.',
          'success'
        );
      }
    });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    const skip = (value - 1) * blogsPerPage;
  
    fetchBlogs(searchTerm.trim() , skip, blogsPerPage);
  };
  
  const handleSearchSubmit = () => {
    fetchBlogs(searchTerm.trim(), 0, blogsPerPage);
  };
  

  const handleClickOpen = (contentUrl) => {
    fetch(contentUrl)
      .then((response) => response.text())
      .then((htmlContent) => {
        setSelectedContent(htmlContent);
        setOpen(true);
      })
      .catch((error) => console.error('Error fetching content:', error));
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' ,width: '500px'}}>
          <TextField
            label="Search by Title"
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            style={{ width: '300px', height: '40px' }}  
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearchSubmit}
            style={{ height: '40px', width: '40px' }}
          >
          <FaSearchDollar />
          </Button>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/admin/add-blog')}
          style={{ marginBottom: '20px', width: '150px' , height: '40px'}}
        >
         <FaPlus />
        </Button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
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
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleClickOpen(blog.content)}
                    >
                      Xem nội dung
                    </Button>
                  </TableCell>
                  <TableCell>{blog.movieId}</TableCell>
                  <TableCell>{new Date(blog.datePosted).toLocaleString()}</TableCell>
                  <TableCell style={{display: 'flex', gap: '10px'}}>
                    <Tooltip title="Update">
                      <IconButton  style={{width:'fit-content'}} color="warning" onClick={() => handleUpdate(blog.blogId)}>
                        <FaEdit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton style={{width:'fit-content'}} color="error" onClick={() => handleDelete(blog.blogId)}>
                        <FaTrashAlt />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      <Stack spacing={2} style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>

      {/* Modal for displaying content */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Blog Content</DialogTitle>
        <DialogContent>
          <div dangerouslySetInnerHTML={{ __html: selectedContent }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BlogManagement;
