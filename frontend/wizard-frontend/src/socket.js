import {io} from "socket.io-client";

// creates the WebSocket for use within the rest of the program
const socket = io("http://localhost:5000");

export default socket;