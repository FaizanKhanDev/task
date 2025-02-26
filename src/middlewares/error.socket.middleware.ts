
import { Server as SocketIOServer, Socket } from 'socket.io';

const socketErrorHandler = (io: SocketIOServer, status: string, message: string, error?: any) => {
    io.emit('error', {
        status: status,
        message: message,
        data: [],
    });
}

export default socketErrorHandler