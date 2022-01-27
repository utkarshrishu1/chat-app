import io from "socket.io-client";
const CONNECTION_PORT='localhost:3000';
const socket=io.connect(CONNECTION_PORT);
export default socket;