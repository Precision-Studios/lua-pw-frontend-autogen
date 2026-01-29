import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
console.log('API_BASE_URL:', API_BASE_URL);

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

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
