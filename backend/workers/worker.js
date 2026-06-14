

// import { Worker } from "bullmq";
// import { io } from "socket.io-client"; // 1. Import io
// import os from "os-utils";
// import connection from "../config/redis.js";
// import { registerWorker, updateHeartbeat } from "./heartbeat.js";

// // 2. Initialize the socket connection globally
// const socket = io("http://localhost:5000"); 

// const workerName = "worker-iad-01";

// // Register and heartbeat
// registerWorker(workerName);
// setInterval(() => updateHeartbeat(workerName), 10000);

// // 3. Now 'socket' is defined and available here
// setInterval(() => {
//     os.cpuUsage((v) => {
//         socket.emit("worker:telemetry", {
//             name: workerName,
//             cpu: Math.round(v * 100),
//             mem: Math.round((1 - os.freememPercentage()) * 100),
//             status: "ACTIVE"
//         });
//     });
// }, 5000);

// const worker = new Worker("emailQueue", async (job) => { 
//     console.log(`Processing: ${job.id}`);
// }, { connection });


// worker.js
import { Worker } from "bullmq";
import { io } from "socket.io-client";
import os from "os"; // Node.js built-in
import osUtils from "os-utils"; // CPU/RAM library
import connection from "../config/redis.js"; // Ensure this path is correct
import { registerWorker, updateHeartbeat } from "./heartbeat.js";

// 1. Initialize Socket
// const socket = io("http://localhost:5000");
const socket = io(process.env.SOCKET_SERVER_URL || "http://localhost:5000");


// ... after initializing socket ...

socket.on("connect", () => {
    console.log("Connected to Socket Server");
    // Register immediately upon connection
    socket.emit("worker:register", { 
        name: workerName, 
        region: "us-east-1", 
        status: "ACTIVE" 
    });
});

// Remove the top-level registerWorker() call that was outside the connection block



// 2. Generate Unique Name
const uniqueId = Math.floor(Math.random() * 10000);
const workerName = `worker-${os.hostname()}-${uniqueId}`;

// 3. Register
registerWorker({ name: workerName, region: "us-east-1" });
setInterval(() => updateHeartbeat(workerName), 10000);

// 4. Telemetry Loop
setInterval(() => {
    osUtils.cpuUsage((v) => {
        socket.emit("worker:telemetry", {
            name: workerName,
            cpu: Math.round(v * 100),
            mem: Math.round((1 - osUtils.freememPercentage()) * 100),
            status: "ACTIVE"
        });
    });
}, 5000);

// 5. THE MISSING PIECE: The BullMQ Worker
const worker = new Worker("emailQueue", async (job) => {
    console.log(`Processing job ${job.id}...`);
    // Simulate task logic
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { success: true };
}, { connection });

worker.on("completed", (job) => console.log(`Job ${job.id} done.`));
worker.on("failed", (job, err) => console.error(`Job ${job.id} failed:`, err));