
// import { Worker } from "bullmq";
// import IORedis from "ioredis";
// import connectDB from "../config/db.js";
// import { io } from "../server.js";

// await connectDB();

// import Job from "../models/Job.js";
// import { sendEmail } from "../services/emailService.js";
// import deadLetterQueue from "../queues/deadLetterQueue.js";
// import { logThroughput } from "../services/throughputLogger.js";
// import { emitJobEvent } from "../utils/socket.js";
// //import { logThroughput } from "../services/throughputLogger.js";

// const connection = new IORedis({
//   maxRetriesPerRequest: null,
// });

// const worker = new Worker(
//   "emailQueue",

//   async (job) => {
//     const { dbJobId, email, subject, message } = job.data;

//     try {
//       console.log(`PID ${process.pid} started Email Job ${job.id}`);

//       await Job.findByIdAndUpdate(dbJobId, {
//         status: "processing",
//         startedAt: new Date(),
//       });

//       console.log(`PID ${process.pid} sending email to ${email}`);

//       const emailResult = await sendEmail(email, subject, message);

//       console.log(`PID ${process.pid} completed Email Job ${job.id}`);

//       await Job.findByIdAndUpdate(dbJobId, {
//         status: "completed",
//         completedAt: new Date(),
//         result: {
//           email,
//           subject,
//           messageId: emailResult.messageId,
//           accepted: emailResult.accepted,
//           response: emailResult.response,
//         },
//       });

//       return { success: true };

//     } catch (error) {
//       console.error(`PID ${process.pid} failed Email Job ${job.id}`);
//       console.error(error);

//       throw error; // IMPORTANT for BullMQ retry system
//     }
//   },

//   {
//     connection,
//     concurrency: 5,
//   }
// );



// //# ✅ COMPLETED EVENT (THROUGHPUT SUCCESS LOGGING)


// worker.on("completed", async (job) => {
//   console.log(`PID ${process.pid} COMPLETED Job ${job.id}`);

//   try {
//     await logThroughput("completed");
//   } catch (err) {
//     console.error("Failed to log throughput (completed)", err);
//   }
// });

import 'dotenv/config'; // This loads the .env file automatically

// ... rest of your imports
import { Worker } from "bullmq";
import IORedis from "ioredis";
// import connectDB from "../config/db.js";
import { connectDB } from "../config/db.js";
import Job from "../models/Job.js";
import { sendEmail } from "../services/emailService.js";
import { logThroughput } from "../services/throughputLogger.js";
import { emitJobEvent } from "../utils/socket.js"; // 1. IMPORT THIS

await connectDB();
const connection = new IORedis({ maxRetriesPerRequest: null });

const worker = new Worker(
  "emailQueue",
  async (job) => {
     console.log("JOB DATA =", job.data);
    const { dbJobId, email, subject, message } = job.data;
    await Job.findByIdAndUpdate(dbJobId, { status: "processing", startedAt: new Date() });
    const emailResult = await sendEmail(email, subject, message);
    await Job.findByIdAndUpdate(dbJobId, { status: "completed", completedAt: new Date(), result: emailResult });
    return { success: true };
  },
  { connection, concurrency: 2 }
);

worker.on("completed", async (job) => {
  await logThroughput("completed");
  // 2. BROADCAST THE UPDATE
  emitJobEvent("stats:update", { jobId: job.id, status: "completed" });
});

// worker.on("failed", async (job, err) => {
//   await Job.findByIdAndUpdate(job.data.dbJobId, { status: "failed", error: err.message, completedAt: new Date() });
//   // 3. BROADCAST THE FAILURE
//   emitJobEvent("stats:update", { jobId: job.id, status: "failed" });
// });
worker.on("failed", async (job, err) => {
  await Job.findByIdAndUpdate(
    job.data.dbJobId,
    {
      status: "failed",
      error: err.message,
      failedAt: new Date()
    }
  );

  await logThroughput("failed");

  emitJobEvent("stats:update", {
    jobId: job.id,
    status: "failed"
  });
});