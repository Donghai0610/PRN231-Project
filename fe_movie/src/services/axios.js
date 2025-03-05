import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: "https://store.wearitout.me", // URL cơ bản của API
    baseURL:"http://localhost:5066",
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 20000,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    function (config) {
        // Kiểm tra nếu API không yêu cầu xác thực
        const noAuthRequired = config.noAuth || false; // Cờ `noAuth` để tắt xác thực nếu được đặt

        if (!noAuthRequired) {
            // Nếu không có cờ `noAuth`, kiểm tra và thêm token từ localStorage
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        // Kiểm tra nếu data là FormData
        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        // Xử lý lỗi tùy thuộc vào mã lỗi
        if (error.response && error.response.status === 400) {
            // localStorage.clear();
            // window.location.href = "/login";
        } else if (error.response && error.response.status === 403) {
            // window.location.href = "/access-denied"
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
