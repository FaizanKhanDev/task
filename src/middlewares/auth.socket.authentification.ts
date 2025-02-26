import { Decrypt } from "../helpers/index";


export const authentification = async (socket: any, next: Function) => {
    const token = socket.handshake.auth.token;
    const decoded = await Decrypt.decryptToken(token);
    if (!decoded) {
        return next(new Error("Authentication error"));
    }
    socket.user = decoded;
    next();
}


