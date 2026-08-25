import { getToken } from './authService';

const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(path, options = {}) {
    const token = getToken();

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        }
    })

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
    }

    return data;
}