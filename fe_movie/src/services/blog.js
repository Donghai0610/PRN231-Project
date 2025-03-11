import axiosInstance from './axios';

const getBlogs = async (filter, skip, top) => {
    try {
        const params = {
            skip: skip,      // Skip number of records
            top: top        // Number of records to fetch
        };

        // Chỉ thêm filter vào params nếu có giá trị
        if (filter && filter.trim() !== '') {
            params.filter = `contains(title, '${filter}')`;
        }

        const response = await axiosInstance.get(`/api/Blog`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching blogs:", error);
        throw error;
    }
};


const getBlogById = async (id) => {
    const response = await axiosInstance.get(`/api/Blog/${id}`);
    return response.data;
};

const createBlog = async (blogData) => {
    try {
        const formData = new FormData();

        formData.append('Title', blogData.title);
        formData.append('MovieId', blogData.movieId);
        formData.append('AppUserId', blogData.appUserId);

        if (blogData.content) {
            // Chuyển nội dung HTML thành Blob (file HTML)
            const contentBlob = new Blob([blogData.content], { type: 'text/html' });
            formData.append('Content', contentBlob, 'content.html');
        }

        const response = await axiosInstance.post(`/api/Blog`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error creating blog:", error);
        throw error;
    }
};

const updateBlog = async (id, blogData) => {
    try {
        const formData = new FormData();

        formData.append('Title', blogData.title);
        formData.append('MovieId', blogData.movieId);
        formData.append('AppUserId', blogData.appUserId);
        formData.append('BlogId', id);

        if (blogData.content) {
            // Chuyển nội dung HTML thành Blob (file HTML)
            const contentBlob = new Blob([blogData.content], { type: 'text/html' });
            formData.append('Content', contentBlob, 'content.html');
        }

        const response = await axiosInstance.put(`/api/Blog/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error creating blog:", error);
        throw error;
    }
};


const deleteBlog = async (id) => {
    const response = await axiosInstance.delete(`/api/Blog/${id}`);
    return response.data;
};

const BlogService = {
    getBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
};

export default BlogService;



