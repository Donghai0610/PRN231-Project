import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BlogService from '../../services/blog';
import './BlogDetail.css';

const BlogDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogDetail = async () => {
            try {
                setLoading(true);
                const blogData = await BlogService.getBlogById(id);
                setBlog(blogData);

                // Fetch content from URL
                if (blogData.content) {
                    const response = await fetch(blogData.content);
                    const htmlContent = await response.text();
                    setContent(htmlContent);
                }
            } catch (err) {
                setError('Không thể tải nội dung blog');
                console.error('Error fetching blog detail:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogDetail();
    }, [id]);

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!blog) {
        return <div className="error">Không tìm thấy bài viết</div>;
    }

    return (
        <div className="blog-detail-container">
            <div className="blog-header">
                <h1 className="blog-title">{blog.title}</h1>
                <div className="blog-meta">
                    <span className="author">Bởi admin</span>
                    <span className="date">{new Date(blog.datePosted).toLocaleDateString('vi-VN')}</span>
                </div>
            </div>
            
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
};

export default BlogDetail;
