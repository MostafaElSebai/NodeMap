import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const API_BASE_URL = `${baseUrl}/api/v1`;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default apiClient;