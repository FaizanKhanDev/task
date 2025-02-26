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
    joined_chat: (data: any) => void;
    receive_message: (data: any) => void;
    get_all_messages: (data: any) => void;
    get_all_chats: (data: any) => void;


}

interface ClientToServerEvents {
    join_chat: (data: any) => void;
    send_message: (data: any) => void;
    open_chat_window: (data: any) => void;
    get_all_chats: (data: any) => void;

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
        /* ========== Join New Chat With Seller *===============*/
        socket.on('join_chat_room', (data) => {
            if (socket.user) {
            } else {
                throw new Error("Authentication error");

            }
        });

        /* ========== Send Message Into The Room *==============*/
        socket.on('send_message', (data) => {
            if (socket.user) {
            } else {
                throw new Error("Authentication error");
            }
        });

        /* ========= Open Chat Window =========*/
        socket.on('open_chat_window', (data) => {
            if (socket.user) {
            } else {
                throw new Error("Authentication error");
            }
        });


        /* ======= Get All Chats =========*/
        socket.on('get_all_chats', () => {
            if (socket.user) {
            } else {
                throw new Error("Authentication error");
            }
        });


        /* ========== Disconnect =========*/
        socket.on('disconnect', () => {
            console.log(`🔥: ${socket.id} user just disconnected!`);
        });
    });

    return { httpServer, io };
}

export default setupSocketServer;
