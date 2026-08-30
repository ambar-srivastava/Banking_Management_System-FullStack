const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io = null;

function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: { origin: process.env.CLIENT_URL || '*' },
    })

    //Auth handshake: client must send its JWT, same token used for REST calls
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token
        if (!token) return next(new Error('Authentication required'))

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return next(new Error('Invalid or expired token'))
            socket.user = decoded // {userId.role}
            next();
        })
    })

    io.on('connection', (socket) => {
        //Personal room per user - lets us target "just this user" without tracking socket Ids ourselves
        socket.join(`user:${socket.user.userId}`)
    })

    return io;
}

function getIO() {
    return io;
}

module.exports = { initSocket, getIO };