


// import express from "express";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import cors from "cors";
// import http from "http";
// import { Server } from "socket.io";
// import { connectDB } from "./config/db.js";
// // import connectDB from "./config/db.js";
// import { initSocket } from "./utils/socket.js"; // Import the initialization helper
// import { ThroughputStat } from "./models/ThroughputStat.js"; 
// import emailRoutes from "./routes/emailRoutes.js";
// import imageRoutes from "./routes/imageRoutes.js";
// import reportRoutes from "./routes/reportRoutes.js";
// import queueRoutes from "./routes/queueRoutes.js";
// import { emailQueue } from "./queues/emailQueue.js";
// import { imageQueue } from "./queues/imageQueue.js";
// import { reportQueue } from "./queues/reportQueue.js";
// import "./workers/worker.js";

// dotenv.config();

// // ======================
// // DATABASE CONNECTION
// // ======================

// connectDB();
// const app = express();
// const server = http.createServer(app);

// const ioInstance = new Server(server, { cors: { origin: "*" } });
// initSocket(ioInstance);

// // --- PLACE YOUR WORKER TRACKING CODE HERE ---
// const activeWorkers = new Map();


// [emailQueue, imageQueue, reportQueue].forEach((queue) => {
//     queue.on("completed", (job) => {
//         console.log(`✅ Job ${job.id} completed. Emitting to UI.`);
//         ioInstance.emit("job:updated", { jobId: job.id, status: "COMPLETED" });
//     });
//     queue.on("failed", (job, err) => {
//         console.log(`❌ Job ${job.id} failed.`);
//         ioInstance.emit("job:updated", { jobId: job.id, status: "FAILED" });
//     });
// });

// // 2. ADD THIS: Telemetry tracking for Worker cards
// ioInstance.on("connection", (socket) => {
//     socket.on("worker:register", (data) => {
//         activeWorkers.set(socket.id, data);
//         ioInstance.emit("worker:count", activeWorkers.size);
//     });

//     socket.on("worker:telemetry", (data) => {
//         if (activeWorkers.has(socket.id)) {
//             const existing = activeWorkers.get(socket.id);
//             activeWorkers.set(socket.id, { ...existing, ...data });
//         }
//     });

//     socket.on("disconnect", () => {
//         activeWorkers.delete(socket.id);
//         ioInstance.emit("worker:count", activeWorkers.size);
//     });
// });

// // ... [rest of your existing server code]
// // --- END OF PLACEMENT ---

// app.use(cors());
// app.use(express.json());

// // ======================
// // ROUTES
// // ======================
// app.get("/api/queue/stats", async (req, res) => {
//     try {
//         const [emailCounts, imageCounts, reportCounts] = await Promise.all([
//             emailQueue.getJobCounts(),
//             imageQueue.getJobCounts(),
//             reportQueue.getJobCounts(),
//         ]);

//         const authTotal = (emailCounts.completed || 0) + (emailCounts.failed || 0);
//         const imageTotal = (imageCounts.completed || 0) + (imageCounts.failed || 0);
//         const dataTotal = (reportCounts.completed || 0) + (reportCounts.failed || 0);
//         const grandTotal = authTotal + imageTotal + dataTotal;

//         let authPct = 33, imagePct = 33, dataPct = 34;
//         if (grandTotal > 0) {
//             authPct = Math.round((authTotal / grandTotal) * 100);
//             imagePct = Math.round((imageTotal / grandTotal) * 100);
//             dataPct = 100 - (authPct + imagePct); 
//         }

//         const realTotalCompleted = (emailCounts.completed || 0) + (imageCounts.completed || 0) + (reportCounts.completed || 0);
//         const realTotalFailed = (emailCounts.failed || 0) + (imageCounts.failed || 0) + (reportCounts.failed || 0);
//         const highestMetric = Math.max(realTotalCompleted, realTotalFailed, 10);
//         const dynamicGraphCeiling = Math.ceil((highestMetric * 1.3) / 10) * 10;

//         const liveTimelineHistory = [
//             { time: "00:00", completed: Math.floor(realTotalCompleted * 0.4), failed: Math.floor(realTotalFailed * 0.2) },
//             { time: "06:00", completed: Math.floor(realTotalCompleted * 0.6), failed: Math.floor(realTotalFailed * 0.5) },
//             { time: "12:00", completed: Math.floor(realTotalCompleted * 0.8), failed: Math.floor(realTotalFailed * 0.7) },
//             { time: "18:00", completed: realTotalCompleted, failed: realTotalFailed }, 
//             { time: "24:00", completed: realTotalCompleted, failed: realTotalFailed }, 
//         ];

//         const jobTypes = ['completed', 'failed', 'active', 'waiting'];
//         const [emailJobs, imageJobs, reportJobs] = await Promise.all([
//             emailQueue.getJobs(jobTypes, 0, 5, false),
//             imageQueue.getJobs(jobTypes, 0, 5, false),
//             reportQueue.getJobs(jobTypes, 0, 5, false)
//         ]);

//         const recentTasks = [...emailJobs, ...imageJobs, ...reportJobs]
//             .map(job => ({
//                 id: `tsk_${job.id || '000' + Math.floor(Math.random() * 9)}`,
//                 title: job.data?.title || `${job.name.charAt(0).toUpperCase() + job.name.slice(1)} execution`,
//                 type: job.queue.name === 'email' ? 'mail' : job.queue.name === 'image' ? 'image' : 'file',
//                 status: job.finishedOn ? (job.failedReason ? 'FAILED' : 'COMPLETED') : 'PROCESSING',
//                 w: job.processedOn ? 'worker-live-node' : '—',
//                 ms: job.finishedOn && job.processedOn ? `${job.finishedOn - job.processedOn}ms` : '—',
//                 timestamp: job.timestamp
//             }))
//             .sort((a, b) => b.timestamp - a.timestamp)
//             .slice(0, 7);

//         res.status(200).json({
//             email: emailCounts,
//             image: imageCounts,
//             report: reportCounts,
//             throughput: liveTimelineHistory,
//             graphCeiling: dynamicGraphCeiling,
//             mixPercentages: { auth: authPct, image: imagePct, data: dataPct },
//             recentTasks: recentTasks
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.use("/api", emailRoutes);
// app.use("/api/image", imageRoutes);
// app.use("/api/report", reportRoutes);
// app.use("/api/queue", queueRoutes);

// app.get("/", (req, res) => {
//     res.json({ success: true, message: "Distributed Task Queue API Running" });
// });

// app.get("/health", async (req, res) => {
//     res.status(200).json({ status: "UP", database: mongoose.connection.readyState === 1 ? "CONNECTED" : "DISCONNECTED" });
// });





// // Add to server.js
// app.get("/api/queue/workers", (req, res) => {
//     // Convert your Map to an array of objects
//     const workerNodes = Array.from(activeWorkers.values()).map(w => ({
//         name: w.name,
//         region: w.region,
//         status: w.status, // "ACTIVE", "IDLE", "OFFLINE"
//         cpu: w.cpu || 0,
//         mem: w.mem || 0,
//         processed: w.processed || 0,
//         failed: w.failed || 0,
//         uptime: w.uptime,
//         successRate: w.successRate || 100,
//         currentTask: w.currentTask || null
//     }));
//     res.json(workerNodes);
// });





// app.use((err, req, res, next) => {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
// });

// // ======================
// // SERVER START
// // ======================
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// // ======================
// // BACKGROUND METRICS TRACKER
// // ======================
// async function recordHourlyThroughput() {
//   try {
//     const [email, image, report] = await Promise.all([
//       emailQueue.getJobCounts(),
//       imageQueue.getJobCounts(),
//       reportQueue.getJobCounts(),
//     ]);
//     const totalCompleted = (email.completed || 0) + (image.completed || 0) + (report.completed || 0);
//     const totalFailed = (email.failed || 0) + (image.failed || 0) + (report.failed || 0);

// const now = new Date();

// const hourString = now.toISOString().slice(0, 13); 
// // Example: "2026-06-14T05"

// await ThroughputStat.create({
//   hourString,              // ✅ REQUIRED FIX
//   completed: completedCount,
//   failed: failedCount,
//   timestamp: now
// });
//     // await ThroughputStat.create({ completed: totalCompleted, failed: totalFailed, timestamp: new Date() });
//     await ThroughputStat.deleteMany({ timestamp: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
//   } catch (error) {
//     console.error("Failed to record metrics:", error);
//   }
// }

// setInterval(recordHourlyThroughput, 1000 * 60 * 60);

// process.on("uncaughtException", (error) => console.error("UNCAUGHT EXCEPTION", error));
// process.on("unhandledRejection", (reason) => console.error("UNHANDLED REJECTION", reason));

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

// import connectDB from "./config/db.js";
// import { connectDB } from "./config/db.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import { initSocket } from "./utils/socket.js";
import { ThroughputStat } from "./models/ThroughputStat.js"; 
import emailRoutes from "./routes/emailRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import queueRoutes from "./routes/queueRoutes.js";
import { emailQueue } from "./queues/emailQueue.js";
import { imageQueue } from "./queues/imageQueue.js";
import { reportQueue } from "./queues/reportQueue.js";
import "./workers/worker.js";
import redis from "./config/redis.js";
import authRoutes from "./routes/authRoutes.js";
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const ioInstance = new Server(server, { cors: { origin: "*" } });
initSocket(ioInstance);






// GLOBAL STATE
const activeWorkers = new Map();

// SOCKET HANDLING
ioInstance.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);

    socket.on("worker:register", (data) => {
        activeWorkers.set(socket.id, data);
        ioInstance.emit("worker:count", activeWorkers.size);
    });

    socket.on("worker:telemetry", (data) => {
        if (activeWorkers.has(socket.id)) {
            const existing = activeWorkers.get(socket.id);
            activeWorkers.set(socket.id, { ...existing, ...data });
        }
    });

    socket.on("disconnect", () => {
        activeWorkers.delete(socket.id);
        ioInstance.emit("worker:count", activeWorkers.size);
        console.log("❌ Client disconnected:", socket.id);
    });
});

// QUEUE EVENT LISTENERS
[emailQueue, imageQueue, reportQueue].forEach((queue) => {
    queue.on("completed", (job) => {
        ioInstance.emit("job:updated", { jobId: job.id, status: "COMPLETED" });
    });
    queue.on("failed", (job, err) => {
        ioInstance.emit("job:updated", { jobId: job.id, status: "FAILED" });
    });
});

app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
  req.redis = redis;
  next();
});

// ======================
// ROUTES
// ======================
app.get("/api/queue/stats", async (req, res) => {
    try {
        const [emailCounts, imageCounts, reportCounts] = await Promise.all([
            emailQueue.getJobCounts(),
            imageQueue.getJobCounts(),
            reportQueue.getJobCounts(),
        ]);

        // 1. Fetch throughput history
        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const throughput = await ThroughputStat.find({ timestamp: { $gte: last24h } }).sort({ timestamp: 1 });

        // 2. FETCH RECENT TASKS (Add this part)
        // We fetch the last 10 completed or failed jobs from all queues
        const [emailJobs, imageJobs, reportJobs] = await Promise.all([
            emailQueue.getJobs(['completed', 'failed'], 0, 5),
            imageQueue.getJobs(['completed', 'failed'], 0, 5),
            reportQueue.getJobs(['completed', 'failed'], 0, 5)
        ]);

        const recentTasks = [...emailJobs, ...imageJobs, ...reportJobs]
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 10)
            .map(job => ({
                id: job.id,
                title: job.data.subject || "No title",
                type: job.queue.name.replace('Queue', '').toLowerCase(),
                status: job.failedReason ? "FAILED" : "COMPLETED",
                w: "Worker-1", // You can replace this with actual worker info if available
                ms: `${job.finishedOn - job.processedOn}ms`
            }));

        // 3. SEND EVERYTHING
        res.status(200).json({
            email: emailCounts,
            image: imageCounts,
            report: reportCounts,
            throughput: throughput,
            recentTasks: recentTasks, // <--- THIS WAS THE MISSING KEY
            workers: Array.from(activeWorkers.values()),
            totalWorkersCount: activeWorkers.size,
            totalThroughputPerMin: throughput.length > 0 ? throughput[throughput.length - 1].completed : 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.use("/api", emailRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/auth", authRoutes);








// ======================
// BACKGROUND METRICS
// ======================
// async function recordHourlyThroughput() {
//   try {
//     const [email, image, report] = await Promise.all([
//       emailQueue.getJobCounts(),
//       imageQueue.getJobCounts(),
//       reportQueue.getJobCounts(),
//     ]);

//     // FIX: Properly defined variables
//     const completedCount = (email.completed || 0) + (image.completed || 0) + (report.completed || 0);
//     const failedCount = (email.failed || 0) + (image.failed || 0) + (report.failed || 0);

//     const now = new Date();
//     await ThroughputStat.create({
//       hourString: now.toISOString().slice(0, 13),
//       completed: completedCount,
//       failed: failedCount,
//       timestamp: now
//     });
//     await ThroughputStat.deleteMany({ timestamp: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
//   } catch (error) {
//     console.error("Failed to record metrics:", error);
//   }
// // }
// async function recordHourlyThroughput() {
//   try {
//     const [email, image, report] = await Promise.all([
//       emailQueue.getJobCounts(),
//       imageQueue.getJobCounts(),
//       reportQueue.getJobCounts(),
//     ]);

//     // Calculate totals explicitly
//     const completedCount = (email.completed || 0) + (image.completed || 0) + (report.completed || 0);
//     const failedCount = (email.failed || 0) + (image.failed || 0) + (report.failed || 0);

//     const now = new Date();
    
//     // Create the document
//     await ThroughputStat.create({
//       hourString: now.toISOString().slice(0, 13),
//       completed: completedCount,
//       failed: failedCount,
//       timestamp: now
//     });

//     // Cleanup: Only keep records from the last 24 hours
//     await ThroughputStat.deleteMany({ timestamp: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
//     console.log(`✅ Metrics recorded: ${completedCount} completed, ${failedCount} failed.`);
//   } catch (error) {
//     console.error("❌ Failed to record metrics:", error);
//   }
// }

// // setInterval(recordHourlyThroughput, 1000 * 60 * 60);
// Add a global variable at the top of your server.js
let lastTotalCompleted = 0; 

async function recordHourlyThroughput() {
  try {
    const [email, image, report] = await Promise.all([
      emailQueue.getJobCounts(),
      imageQueue.getJobCounts(),
      reportQueue.getJobCounts(),
    ]);

    const currentTotalCompleted = (email.completed || 0) + (image.completed || 0) + (report.completed || 0);
    
    // Calculate how many jobs were completed SINCE the last time we ran this
    const deltaCompleted = Math.max(0, currentTotalCompleted - lastTotalCompleted);
    lastTotalCompleted = currentTotalCompleted;

    const now = new Date();
    await ThroughputStat.create({
      hourString: now.toISOString().slice(0, 13),
      completed: deltaCompleted, // Save the difference
      failed: 0, // You can add logic for failed delta too
      timestamp: now
    });
  } catch (error) {
    console.error("Metrics Error:", error);
  }
}
// --- REPLACE THIS SECTION ---
// Run once immediately on server startup so the chart has data
recordHourlyThroughput();


// ======================
// HEALTH CHECK
// ======================

app.get("/health", async (req, res) => {
    try {

        const mongoState = mongoose.connection.readyState;

        res.status(200).json({
            status: "UP",
            database:
                mongoState === 1
                    ? "CONNECTED"
                    : "DISCONNECTED",
            uptime: process.uptime(),
            timestamp: new Date(),
        });

    } catch (error) {

        res.status(500).json({
            status: "DOWN",
            error: error.message,
        });

    }
});


// ======================
// QUEUE STATS
// ======================

app.get("/queue/stats", async (req, res) => {

    try {

        const emailCounts =
            await emailQueue.getJobCounts();

        const imageCounts =
            await imageQueue.getJobCounts();

        const reportCounts =
            await reportQueue.getJobCounts();

        res.status(200).json({
            emailQueue: emailCounts,
            imageQueue: imageCounts,
            reportQueue: reportCounts,
        });

    } catch (error) {

        res.status(500).json({
            error: error.message,
        });

    }
});


// ======================
// ERROR HANDLER
// ======================

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({
        success: false,
        message:
            err.message ||
            "Internal Server Error",
    });

});


// ======================
// SERVER START
// ======================

// const PORT =
//     process.env.PORT || 5000;

// app.listen(PORT, () => {

//     console.log(
//         `Server running on port ${PORT}`
//     );

// });


// ======================
// PROCESS LEVEL ERRORS
// ======================

process.on(
    "uncaughtException",
    (error) => {

        console.error(
            "UNCAUGHT EXCEPTION"
        );

        console.error(error);

    }
);

process.on(
    "unhandledRejection",
    (reason) => {

        console.error(
            "UNHANDLED REJECTION"
        );

        console.error(reason);

    }
);
// Then set it to run every hour (1000ms * 60s * 60m)
// If testing, you can change this to 1000 * 60 for 1-minute intervals
//setInterval(recordHourlyThroughput, 1000 * 60 * 60);
// Change this line to update every 10 seconds while testing
setInterval(recordHourlyThroughput, 1000 * 10);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
