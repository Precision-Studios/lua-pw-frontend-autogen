import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
console.log('API_BASE_URL:', API_BASE_URL);

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config;

        // Check if error is 401 and we haven't tried to refresh yet
        // @ts-ignore - _retry is a custom property we use to prevent infinite loops
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            // @ts-ignore
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token
                await authApi.refresh();

                // If refresh succeeds, retry the original request
                return apiClient(originalRequest);
            } catch (refreshError) {
                // If refresh fails, redirect to login
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const authApi = {
    login: (data: {
        idOrEmailIdentifier: string;
        userPassword: string;
    }) => apiClient.post('/api/v1/auth/login', data),

    register: (data: {
        emailAddress: string;
        password: string;
    }) => apiClient.post('/api/v1/user/register', data),

    updateUser: (data: {
        newPassword: string;
    }) => apiClient.post('/api/v1/user/update', data),

    refresh: () => apiClient.post('/api/v1/auth/refresh'),

    logout: () => apiClient.post('/api/v1/auth/logout'),
};

export const userApi = {
    details: () => apiClient.get('/api/v1/user/details'),
    allUrls: () => apiClient.get('/api/v1/user/all'),
};

export const urlApi = {
    shorten: (longUrl: string) =>
        apiClient.post('/api/v1/urls/shorten', { longUrl }),

    generateQR: (urlForQR: string) =>
        apiClient.post('/api/v1/urls/add_qr', { urlForQR }),
};

export const redirectApi = {
    resolve: (shortCode: string, qr?: boolean) =>
        apiClient.get(`/${shortCode}`, { params: { qr } }),
};
