import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http';
import { authentification } from "../middlewares/auth.socket.authentification";
import 'socket.io';
declare module 'socket.io' {
    interface Socket {
        user?: any;
    }
}
interface ServerToClientEvents {


}

interface ClientToServerEvents {

}

const setupSocketServer = (app: any) => {
    const httpServer = http.createServer(app);
    const io = new SocketIOServer
        <
            ServerToClientEvents,
            ClientToServerEvents
        >(httpServer, {
            cors: {
                origin: "*",
            }
        });

    /* ===== Authentification ====== */
    io.use(authentification);


    /* -------------------- Connnection BetWeen  -------------------- */
    io.on('connection', (socket: Socket) => {
        if (socket.user) {
            console.log(`⚡: ${socket.id} ${socket.user.id} user just connected!`);
        }
    });

    return { httpServer, io };
}

export default setupSocketServer;
