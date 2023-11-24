import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
dotenv.config()
import cors from 'cors';
import authRoutes from './routes/AuthRoutes.js';
import messageRoutes from './routes/MessageRoutes.js';
import { Server } from 'socket.io';

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet({
    frameguard: {
        action: 'deny'
    },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "*.fontawesome.com", "'unsafe-inline'"],
            scriptSrc: ["'self'", "*.fontawesome.com"],
            connectSrc: ["'self'", "*.fontawesome.com"],
        },
    }
}));
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

app.use(express.static('public'));
app.use('/uploads/images', express.static('uploads/images'));
app.use('/uploads/recordings', express.static('uploads/recordings'));

app.use('/api/auth', authRoutes);

app.use('/api/messages', messageRoutes);

const server = app.listen(process.env.PORT || 4444, () => console.log(`Server Port: ${process.env.PORT}`));

const io = new Server(server, {
    cors: {
        origin: 'https://wave-link.vercel.app'
    }
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id);
        socket.broadcast.emit('online-user', {
            onlineUsers: Array.from(onlineUsers.keys()),
        })
    });

    socket.on('signout', (id) => {
        onlineUsers.delete(id);
        socket.broadcast.emit('online-user', {
            onlineUsers: Array.from(onlineUsers.keys()),
        })
    })

    socket.on('send-msg', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", {
                from: data.from,
                message: data.message
            });
        }
    });
})