import io from "socket.io-client";
const CONNECTION_PORT='chat-app-server-omega.vercel.app';
const socket=io.connect(CONNECTION_PORT);
export default socket;
