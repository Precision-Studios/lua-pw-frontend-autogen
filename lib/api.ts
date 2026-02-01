import axios, { AxiosError } from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL && typeof window !== 'undefined') {
    console.error('NEXT_PUBLIC_API_BASE_URL is not defined! API calls will fail.');
}
console.log('API_BASE_URL:', API_BASE_URL);

export const apiClient = axios.create({
    baseURL: '', // Defaults to current origin (https://lua.pw)
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
        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            originalRequest.url !== '/api/v1/auth/refresh' &&
            originalRequest.url !== '/api/v1/auth/login' &&
            originalRequest.url !== '/api/v1/auth/logout'
        ) {
            // @ts-ignore
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token
                await authApi.refresh();

                // If refresh succeeds, retry the original request
                return apiClient(originalRequest);
            } catch (refreshError) {
                // If refresh fails, redirect to home (login)
                if (typeof window !== 'undefined') {
                    window.location.href = '/';
                }
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

export const normalizeUrl = (url: string): string => {
    let normalized = url.trim();
    if (!normalized) return normalized;

    // Check if it has a protocol-like structure (something followed by ://)
    const protocolIndex = normalized.indexOf('://');

    if (protocolIndex !== -1) {
        const rest = normalized.substring(protocolIndex + 3);
        // Special case for localhost in development
        if (rest.startsWith('localhost') || rest.startsWith('127.0.0.1')) {
            const protocol = normalized.substring(0, protocolIndex);
            if (protocol === 'http' || protocol === 'https') return normalized;
            return 'http://' + rest;
        }
        // Replace whatever protocol was there with https://
        // to satisfy "should all transform same" and handle typos like "htttp"
        normalized = 'https://' + rest;
    } else {
        // No protocol found
        if (normalized.startsWith('localhost') || normalized.startsWith('127.0.0.1')) {
            normalized = 'http://' + normalized;
        } else {
            normalized = 'https://' + normalized;
        }
    }

    return normalized;
};

export const urlApi = {
    shorten: (longUrl: string) =>
        apiClient.post('/api/v1/urls/shorten', { longUrl: normalizeUrl(longUrl) }),

    generateQR: (urlForQR: string) =>
        apiClient.post('/api/v1/urls/add_qr', { urlForQR: normalizeUrl(urlForQR) }),
};

export const redirectApi = {
    resolve: (shortCode: string, qr?: boolean) =>
        apiClient.get(`/${shortCode}`, { params: { qr } }),
};
