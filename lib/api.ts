import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authApi = {
    login: (data: any) => apiClient.post('/api/v1/auth/login', data),
    register: (data: any) => apiClient.post('/api/v1/auth/register', data),
    update: (data: any) => apiClient.post('/api/v1/auth/update', data),
    logout: () => apiClient.post('/api/v1/auth/logout'),
};

export const urlApi = {
    shorten: (longUrl: string) => apiClient.post('/api/v1/generate_short_url', { longUrl }),
    generateQR: (urlForQR: string) => apiClient.post('/api/v1/generate_qr_code', { urlForQR }),
};
