import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pagination, Stack, CircularProgress } from '@mui/material';
import BlogService from '../../services/blog';
import './BlogReview.css';
import axiosInstance from '../../services/axios';
import { TextField, InputAdornment, IconButton, Box, Typography } from '@mui/material';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useDebounce } from 'use-debounce';

const BlogReview = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTitle, setSearchTitle] = useState('');
    const [debouncedSearchTitle] = useDebounce(searchTitle, 1000);
    const itemsPerPage = 9;
    const [author, setAuthor] = useState(localStorage.getItem('account'));

    const fetchBlogs = async (page, searchTerm = "") => {
        try {
            setLoading(true);
            setError(null);
            const skip = (page - 1) * itemsPerPage;
            const response = await BlogService.getBlogs(searchTerm, skip, itemsPerPage);
            setBlogs(response);

            const totalItems = await axiosInstance.get('/api/Blog');
            setTotalPages(Math.ceil(totalItems.data.length / itemsPerPage));

        } catch (err) {
            setError('Đã xảy ra lỗi khi tải blog');
            console.error('Error fetching blogs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs(currentPage, debouncedSearchTitle);
    }, [currentPage, debouncedSearchTitle]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };

    const handleSearch = (event) => {
        setSearchTitle(event.target.value);
        setCurrentPage(1);
    };

    const handleClearSearch = () => {
        setSearchTitle('');
        setCurrentPage(1);
    };

    return (
        <div className="blog-review-container">
            <Box className="blog-header">
                <Typography variant="h1" className="main-title">
                    Blog Review Phim
                </Typography>
                <Typography variant="subtitle1" className="description">
                    Khám phá những bài viết đánh giá chi tiết về các bộ phim mới nhất và hay nhất. 
                    Cùng chia sẻ những góc nhìn độc đáo về điện ảnh và những câu chuyện thú vị đằng sau màn ảnh.
                </Typography>
            </Box>

            <div className="search-container">
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Tìm kiếm bài viết..."
                    value={searchTitle}
                    onChange={handleSearch}
                    className="search-input"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FaSearch className="search-icon" />
                            </InputAdornment>
                        ),
                        endAdornment: searchTitle && (
                            <InputAdornment position="end">
                                <IconButton 
                                    onClick={handleClearSearch}
                                    size="small"
                                    className="clear-button"
                                >
                                    <FaTimes />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </div>

            {loading ? (
                <div className="loading-container">
                    <CircularProgress color="error" />
                    <Typography>Đang tải bài viết...</Typography>
                </div>
            ) : error ? (
                <div className="error-container">
                    <Typography color="error">{error}</Typography>
                </div>
            ) : (
                <>
                    <div className="blog-grid">
                        {blogs.length > 0 ? blogs.map((blog) => (
                            <article key={blog.id} className="blog-card">
                                <div className="blog-image">
                                    <img src='https://img.lovepik.com/free-png/20210928/lovepik-chinese-journalists-day-png-image_401645059_wh1200.png' alt={blog.title} />
                                    <span className="category-tag">Review</span>
                                </div>
                                <div className="blog-content">
                                    <Link to={`/blog-detail/${blog.blogId}`} className="blog-title">
                                        {blog.title}
                                    </Link>
                                    <div className="blog-meta">
                                        <span className="author">Bởi admin</span>
                                        <span className="date">{new Date(blog.datePosted).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                </div>
                            </article>
                        )) : (
                            <div className="no-results">
                                <Typography variant="h6">Không tìm thấy bài viết nào</Typography>
                                <Typography variant="body2">
                                    {searchTitle ? 'Thử tìm kiếm với từ khóa khác' : 'Chưa có bài viết nào được đăng'}
                                </Typography>
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination-container">
                            <Stack spacing={2}>
                                <Pagination 
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    color="error"
                                    size="large"
                                    className="pagination"
                                />
                            </Stack>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default BlogReview;
