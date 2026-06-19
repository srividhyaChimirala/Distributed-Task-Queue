
// import 'dotenv/config'; // This loads the .env file automatically

// // ... rest of your imports
// import { Worker } from "bullmq";
// import IORedis from "ioredis";
// // import connectDB from "../config/db.js";
// import { connectDB } from "../config/db.js";
// import Job from "../models/Job.js";
// import { sendEmail } from "../services/emailService.js";
// import { logThroughput } from "../services/throughputLogger.js";
// import { emitJobEvent } from "../utils/socket.js"; // 1. IMPORT THIS

// await connectDB();
// const connection = new IORedis({ maxRetriesPerRequest: null });

// const worker = new Worker(
//   "emailQueue",
//   async (job) => {
//      console.log("JOB DATA =", job.data);
//     const { dbJobId, email, subject, message } = job.data;
//     await Job.findByIdAndUpdate(dbJobId, { status: "processing", startedAt: new Date() });
//     const emailResult = await sendEmail(email, subject, message);
//     await Job.findByIdAndUpdate(dbJobId, { status: "completed", completedAt: new Date(), result: emailResult });
//     return { success: true };
//   },
//   { connection, concurrency: 2 }
// );

// worker.on("completed", async (job) => {
//   await logThroughput("completed");
//   // 2. BROADCAST THE UPDATE
//   emitJobEvent("stats:update", { jobId: job.id, status: "completed" });
// });

// // worker.on("failed", async (job, err) => {
// //   await Job.findByIdAndUpdate(job.data.dbJobId, { status: "failed", error: err.message, completedAt: new Date() });
// //   // 3. BROADCAST THE FAILURE
// //   emitJobEvent("stats:update", { jobId: job.id, status: "failed" });
// // });
// worker.on("failed", async (job, err) => {
//   await Job.findByIdAndUpdate(
//     job.data.dbJobId,
//     {
//       status: "failed",
//       error: err.message,
//       failedAt: new Date()
//     }
//   );

//   await logThroughput("failed");

//   emitJobEvent("stats:update", {
//     jobId: job.id,
//     status: "failed"
//   });
// });
import "dotenv/config";

import { Worker } from "bullmq";
import connection from "../config/redis.js";

import { connectDB } from "../config/db.js";
import Job from "../models/Job.js";
import { sendEmail } from "../services/emailService.js";
import { logThroughput } from "../services/throughputLogger.js";
import { emitJobEvent } from "../utils/socket.js";

await connectDB();

const worker = new Worker(
  "emailQueue",
  async (job) => {
    console.log("EMAIL JOB DATA =", job.data);

    const {
      dbJobId,
      userId,
      email,
      subject,
      message,
    } = job.data;

    try {
      await Job.findByIdAndUpdate(dbJobId, {
        status: "processing",
        startedAt: new Date(),
      });

      const emailResult = await sendEmail(
        email,
        subject,
        message
      );

      await Job.findByIdAndUpdate(dbJobId, {
        status: "completed",
        completedAt: new Date(),
        result: emailResult,
      });

      return {
        success: true,
        userId,
      };
    } catch (error) {
      await Job.findByIdAndUpdate(dbJobId, {
        status: "failed",
        error: error.message,
        failedAt: new Date(),
      });

      throw error;
    }
  },
  {
    connection,
    concurrency: 2,
  }
);

worker.on("completed", async (job) => {
  try {
    if (job?.data?.userId) {
      await logThroughput(
        "completed",
        job.data.userId
      );
    }

    emitJobEvent("stats:update", {
      jobId: job.id,
      userId: job?.data?.userId,
      status: "completed",
    });

    console.log(`Email job ${job.id} completed`);
  } catch (error) {
    console.error(
      "Completed handler error:",
      error
    );
  }
});

worker.on("failed", async (job, err) => {
  try {
    if (job?.data?.dbJobId) {
      await Job.findByIdAndUpdate(
        job.data.dbJobId,
        {
          status: "failed",
          error: err.message,
          failedAt: new Date(),
        }
      );
    }

    if (job?.data?.userId) {
      await logThroughput(
        "failed",
        job.data.userId
      );
    }

    emitJobEvent("stats:update", {
      jobId: job?.id,
      userId: job?.data?.userId,
      status: "failed",
      error: err.message,
    });

    console.error(
      `Email job ${job?.id} failed:`,
      err.message
    );
  } catch (error) {
    console.error(
      "Failed handler error:",
      error
    );
  }
});

worker.on("error", (err) => {
  console.error("Email Worker Error:", err);
});

console.log("=================================");
console.log("Email Worker Started");
console.log("=================================");