import io from "socket.io-client";
const CONNECTION_PORT='wss://chat-app-serverr.herokuapp.com/ws';
const socket=io.connect(CONNECTION_PORT);
export default socket;