import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear local storage and potentially redirect to login
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('user');
            // Ideally trigger a logout action in context, but simpler here for now:
            // window.location.href = '/login'; 
            // Avoiding hard reload/redirect here to let Context handle it statefully if possible,
            // but without access to Context here, we just reject.
        }
        return Promise.reject(error);
    }
);

export default api;
