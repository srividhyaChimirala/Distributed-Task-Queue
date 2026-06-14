// import { io } from "../server.js";

// export const emitStats = (stats) => {
//     io.emit("stats:update", stats);
// };

// export const emitJobEvent = (event, data) => {
//     io.emit(event, data);
// };

let io;

// This function is called from server.js
export const initSocket = (socketIoInstance) => {
    io = socketIoInstance;
};

export const emitStats = (stats) => {
    if (io) io.emit("stats:update", stats);
};

export const emitJobEvent = (event, data) => {
    if (io) io.emit(event, data);
};