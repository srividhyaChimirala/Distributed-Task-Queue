

// import { Worker } from "bullmq";
// import connectDB from "../config/db.js";
// await connectDB();

// import connection from "../config/redis.js";
// import Job from "../models/Job.js";
// import { processImage } from "../services/imageService.js";
// import deadLetterQueue from "../queues/deadLetterQueue.js";
// import { logThroughput } from "../services/throughputLogger.js";
// import { io } from "../server.js";
// import { emitJobEvent } from "../utils/socket.js";
// // import { logThroughput } from "../services/throughputLogger.js";
// // ======================
// // WORKER
// // ======================

// const imageWorker = new Worker(
//   "imageQueue",

//   async (job) => {
//     const { dbJobId } = job.data;

//     try {
//       console.log(`PID ${process.pid} started Image Job ${job.id}`);

//       await Job.findByIdAndUpdate(dbJobId, {
//         status: "processing",
//         startedAt: new Date(),
//         workerId: `PID-${process.pid}`,
//       });

//       const processedImage = await processImage(job.data);

//       await Job.findByIdAndUpdate(dbJobId, {
//         status: "completed",
//         completedAt: new Date(),
//         result: { processedImage },
//       });

//       console.log(`PID ${process.pid} completed Image Job ${job.id}`);

//       return { success: true, processedImage };

//     } catch (error) {
//       console.error(`PID ${process.pid} failed Image Job ${job.id}`);
//       console.error(error);
//       throw error;
//     }
//   },
//   {
//     connection,
//     concurrency: 3,
//   }
// );

// // ======================
// // COMPLETED EVENT
// // ======================

// imageWorker.on("completed", async (job) => {
//   console.log(`PID ${process.pid} COMPLETED Image Job ${job.id}`);

//   try {
//     await logThroughput("completed");
//   } catch (err) {
//     console.error("Throughput log failed (completed):", err);
//   }
// });

// // ======================
// // FAILED EVENT
// // ======================

// imageWorker.on("failed", async (job, err) => {
//   console.log(`PID ${process.pid} FAILED Image Job ${job?.id}`);
//   console.log(`Attempts Made: ${job?.attemptsMade}`);
//   console.log(`Max Attempts: ${job?.opts?.attempts}`);
//   console.error(`Failure: ${err.message}`);

//   try {
//     await logThroughput("failed");
//   } catch (logErr) {
//     console.error("Throughput log failed (failed):", logErr);
//   }

//   if (job && job.attemptsMade === job.opts.attempts) {
//     console.log(`Image Job ${job.id} permanently failed`);

//     try {
//       await deadLetterQueue.add("failedImageJob", {
//         originalJobId: job.id,
//         data: job.data,
//         error: err.message,
//         failedAt: new Date(),
//         attemptsMade: job.attemptsMade,
//       });
//     } catch (dlqError) {
//       console.error("DLQ error:", dlqError);
//     }

//     try {
//       await Job.findByIdAndUpdate(job.data.dbJobId, {
//         status: "failed",
//         error: err.message,
//         attemptsMade: job.attemptsMade,
//         failedAt: new Date(),
//       });
//     } catch (dbError) {
//       console.error("DB update failed:", dbError);
//     }
//   }
// });

// // ======================
// // STALLED EVENT
// // ======================

// imageWorker.on("stalled", (jobId) => {
//   console.warn(`Image Job ${jobId} stalled and will retry`);
// });

// // ======================
// // ERROR EVENT
// // ======================

// imageWorker.on("error", (err) => {
//   console.error(`PID ${process.pid} IMAGE WORKER ERROR`);
//   console.error(err);
// });

// // ======================
// // SHUTDOWN
// // ======================

// const shutdown = async (signal) => {
//   console.log(`Received ${signal}. Closing Image Worker...`);

//   try {
//     await imageWorker.close();
//     console.log("Image Worker closed successfully");
//     process.exit(0);
//   } catch (error) {
//     console.error("Shutdown error:", error);
//     process.exit(1);
//   }
// };

// process.on("SIGINT", () => shutdown("SIGINT"));
// process.on("SIGTERM", () => shutdown("SIGTERM"));

// // ======================
// // START LOG
// // ======================

// console.log(`Image Worker Running - PID ${process.pid}`);

// export default imageWorker;
import { Worker } from "bullmq";
import IORedis from "ioredis";
// import connectDB from "../config/db.js";
import { connectDB } from "../config/db.js";
import connection from "../config/redis.js";
import Job from "../models/Job.js";
import { processImage } from "../services/imageService.js";
import { logThroughput } from "../services/throughputLogger.js";
import { emitJobEvent } from "../utils/socket.js"; 
import {
  registerWorker,
  updateHeartbeat,
} from "./heartbeat.js";

await connectDB();

const imageWorker = new Worker(
  "imageQueue",
  async (job) => {
    const { dbJobId } = job.data;
    await Job.findByIdAndUpdate(dbJobId, { status: "processing", startedAt: new Date() });
    
    const processedImage = await processImage(job.data);
    
    await Job.findByIdAndUpdate(dbJobId, { 
        status: "completed", 
        completedAt: new Date(), 
        result: { processedImage } 
    });
    return { success: true };
  },
  { connection, concurrency: 2 }
);

// imageWorker.on("completed", async (job) => {
//   await logThroughput("completed");
//   emitJobEvent("stats:update", { jobId: job.id, status: "completed" });
// });



await registerWorker("image-worker");

setInterval(() => {
  updateHeartbeat("image-worker");
}, 5000);









imageWorker.on("completed", async (job) => {
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
});

// imageWorker.on("failed", async (job, err) => {
//   await Job.findByIdAndUpdate(job.data.dbJobId, { status: "failed", error: err.message, completedAt: new Date() });
//   emitJobEvent("stats:update", { jobId: job.id, status: "failed" });
// });
imageWorker.on("failed", async (job, err) => {
  await Job.findByIdAndUpdate(
    job.data.dbJobId,
    {
      status: "failed",
      error: err.message,
      completedAt: new Date(),
    }
  );

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
  });
});




