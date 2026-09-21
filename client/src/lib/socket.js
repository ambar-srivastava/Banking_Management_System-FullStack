import { io } from 'socket.io-client'

let socket = null;

export function connectSoket(token) {
    if (socket?.connected) return socket;

    // FIXED: Added the Render backend URL as an explicit fallback
    const socketUrl = import.meta.env.VITE_SOCKET_URL || "https://banking-management-api-wyh0.onrender.com";

    socket = io(socketUrl, {
        auth: { token },
    });

    return socket;
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}