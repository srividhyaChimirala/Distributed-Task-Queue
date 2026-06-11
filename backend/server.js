// import express from "express";
// import dotenv from "dotenv";

// import connectDB from "./config/db.js";

// import emailRoutes from "./routes/emailRoutes.js";
// import imageRoutes from "./routes/imageRoutes.js";
// import reportRoutes from "./routes/reportRoutes.js";

// dotenv.config();

// // MongoDB Connection
// connectDB();

// const app = express();

// app.use(express.json());

// // Routes
// app.use("/api", emailRoutes);

// app.use("/api/image", imageRoutes);

// app.use("/api/report", reportRoutes);

// app.get("/", (req, res) => {
//   res.send("Distributed Task Queue API Running");
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "./config/db.js";

import emailRoutes from "./routes/emailRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

import { emailQueue } from "./queues/emailQueue.js";
import { imageQueue } from "./queues/imageQueue.js";
import { reportQueue } from "./queues/reportQueue.js";

dotenv.config();

// ======================
// DATABASE CONNECTION
// ======================

connectDB();

const app = express();

app.use(express.json());


// ======================
// ROUTES
// ======================

app.use("/api", emailRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/report", reportRoutes);


// ======================
// ROOT ROUTE
// ======================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Distributed Task Queue API Running",
        timestamp: new Date(),
    });
});


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

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});


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