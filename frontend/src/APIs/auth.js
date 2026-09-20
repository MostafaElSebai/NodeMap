import apiClient from "./apiClient";

export async function register(data) {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
}


export async function login(data) {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
}

export async function registerAsGuest() {
    const response = await apiClient.post('/auth/register', { role: "guest" });
    return response.data;
}

export async function registerGuest(data) {
    const response = await apiClient.post('/auth/registerGuest', data);
    return response.data;
}

export async function logout() {
    const response = await apiClient.get('/auth/logout');
    return response.data;
}


export async function showMe() {
    const response = await apiClient.get('/users/showMe');
    return response.data;
}
