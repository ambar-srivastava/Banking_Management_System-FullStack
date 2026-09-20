import axiosClient from "@/lib/axiosClient";

export async function registerUser(userData) {
    const { data } = await axiosClient.post('/auth/register', userData);
    return data;
};

export async function loginUser(credentials) {
    const { data } = await axiosClient.post('/auth/login', credentials);
    return data;
};

export function saveSession(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
};

export function getToken() {
    return localStorage.getItem('token');
}

export function getUser() {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
};

export function clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export async function verifyTwoFactorLogin(preAuthToken, token) {
    const { data } = await axiosClient.post('/auth/2fa/login-verify', { preAuthToken, token });
    return data;
}