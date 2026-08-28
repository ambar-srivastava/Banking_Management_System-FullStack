import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,   // ✅ correct casing
    headers: {
        "Content-Type": "application/json",
    },
});

// REQUEST interceptor — runs before every single request leaves the app.
// This is what attaches the JWT automatically, so no service file
// ever has to remember to do it manually.
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

// RESPONSE interceptor — runs on every response before it reaches our code.
axiosClient.interceptors.response.use((response) => response, (error) => {
    // If the token is invalid or expired, the backend's authMiddleware
    // (Lesson 4) returns 401/403 — that's our cue to log the user out
    // and send them back to login, no matter which page triggered it.
    if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    }

    // Normalize the error so every caller can just read err.message,
    // whether the failure came from our backend's JSON error shape
    // or from axios itself (e.g. network failure, timeout).
    const message = error.response?.data?.error || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
})

export default axiosClient;