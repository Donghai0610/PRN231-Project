import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pagination, Stack } from '@mui/material';
import BlogService from '../../services/blog';
import './BlogReview.css';
import axiosInstance from '../../services/axios';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const BlogReview = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTitle, setSearchTitle] = useState('');
    const itemsPerPage = 8;
    const [author, setAuthor] = useState(localStorage.getItem('account'));

  

    const fetchBlogs = async (page) => {
        try {
            setLoading(true);
            setError(null);
            const skip = (page - 1) * itemsPerPage;
            const response = await BlogService.getBlogs(searchTitle, skip, itemsPerPage);
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
        fetchBlogs(currentPage);
    }, [currentPage, searchTitle]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };

    const handleSearch = (event) => {
        setSearchTitle(event.target.value);
        setCurrentPage(1); // Reset về trang 1 khi search
    };

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="blog-review-container">
            <h1 className="main-title">Blog Review Phim</h1>
            <p className="description">
                Khám phá những bài viết đánh giá chi tiết về các bộ phim mới nhất và hay nhất. 
                Cùng chia sẻ những góc nhìn độc đáo về điện ảnh và những câu chuyện thú vị đằng sau màn ảnh.
            </p>

            <div className="search-container">
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Tìm kiếm bài viết..."
                    value={searchTitle}
                    onChange={handleSearch}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </div>

            <div className="blog-grid">
                {blogs.map((blog) => (
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
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination-container">
                    <Stack spacing={2}>
                        <Pagination 
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            size="large"
                        />
                    </Stack>
                </div>
            )}
        </div>
    );
};

export default BlogReview;
