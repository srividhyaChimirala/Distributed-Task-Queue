
// import { Worker } from "bullmq";
// import connectDB from "../config/db.js";

// await connectDB();

// import connection from "../config/redis.js";
// import Job from "../models/Job.js";
// import { generateReport } from "../services/reportService.js";
// import deadLetterQueue from "../queues/deadLetterQueue.js";
// import { logThroughput } from "../services/throughputLogger.js";
// import { io } from "../server.js";
// import { emitJobEvent } from "../utils/socket.js";
// // import { logThroughput } from "../services/throughputLogger.js";

// // ======================
// // WORKER
// // ======================

// const reportWorker = new Worker(
//   "reportQueue",

//   async (job) => {
//     const { dbJobId } = job.data;

//     try {
//       console.log(`PID ${process.pid} started Report Job ${job.id}`);

//       await Job.findByIdAndUpdate(dbJobId, {
//         status: "processing",
//         startedAt: new Date(),
//         workerId: `PID-${process.pid}`,
//       });

//       const reportPath = await generateReport(job.data);

//       await Job.findByIdAndUpdate(dbJobId, {
//         status: "completed",
//         completedAt: new Date(),
//         result: { reportPath },
//       });

//       console.log(`PID ${process.pid} completed Report Job ${job.id}`);

//       return {
//         success: true,
//         reportPath,
//       };

//     } catch (error) {
//       console.error(`PID ${process.pid} failed Report Job ${job.id}`);
//       console.error(error);
//       throw error;
//     }
//   },
//   {
//     connection,
//     concurrency: 2,
//   }
// );

// // ======================
// // COMPLETED EVENT
// // ======================

// reportWorker.on("completed", async (job) => {
//   console.log(`PID ${process.pid} COMPLETED Report Job ${job.id}`);

//   try {
//     await logThroughput("completed");
//   } catch (err) {
//     console.error("Throughput log failed (completed):", err);
//   }
// });

// // ======================
// // FAILED EVENT
// // ======================

// reportWorker.on("failed", async (job, err) => {
//   console.log(`PID ${process.pid} FAILED Report Job ${job?.id}`);
//   console.log(`Attempts Made: ${job?.attemptsMade}`);
//   console.log(`Max Attempts: ${job?.opts?.attempts}`);
//   console.error(`Failure Reason: ${err.message}`);

//   try {
//     await logThroughput("failed");
//   } catch (logErr) {
//     console.error("Throughput log failed (failed):", logErr);
//   }

//   if (job && job.attemptsMade === job.opts.attempts) {
//     console.log(`Report Job ${job.id} permanently failed`);

//     try {
//       await deadLetterQueue.add("failedReportJob", {
//         originalJobId: job.id,
//         data: job.data,
//         error: err.message,
//         failedAt: new Date(),
//         attemptsMade: job.attemptsMade,
//       });

//       console.log(`Report Job ${job.id} moved to Dead Letter Queue`);

//     } catch (dlqError) {
//       console.error("Failed to move Report Job to DLQ", dlqError);
//     }

//     try {
//       await Job.findByIdAndUpdate(job.data.dbJobId, {
//         status: "failed",
//         error: err.message,
//         attemptsMade: job.attemptsMade,
//         failedAt: new Date(),
//       });

//     } catch (dbError) {
//       console.error("Failed updating MongoDB", dbError);
//     }
//   }
// });

// // ======================
// // STALLED EVENT
// // ======================

// reportWorker.on("stalled", (jobId) => {
//   console.warn(`Report Job ${jobId} stalled and will be retried`);
// });

// // ======================
// // WORKER ERROR EVENT
// // ======================

// reportWorker.on("error", (err) => {
//   console.error(`PID ${process.pid} REPORT WORKER ERROR`);
//   console.error(err);
// });

// // ======================
// // SHUTDOWN
// // ======================

// const shutdown = async (signal) => {
//   console.log(`Received ${signal}. Closing Report Worker...`);

//   try {
//     await reportWorker.close();
//     console.log("Report Worker closed successfully");
//     process.exit(0);
//   } catch (error) {
//     console.error("Error while closing Report Worker", error);
//     process.exit(1);
//   }
// };

// process.on("SIGINT", () => shutdown("SIGINT"));
// process.on("SIGTERM", () => shutdown("SIGTERM"));

// // ======================
// // START LOG
// // ======================

// console.log(`Report Worker Running - PID ${process.pid}`);

// export default reportWorker;
import { Worker } from "bullmq";
import IORedis from "ioredis";
// import connectDB from "../config/db.js";
import { connectDB } from "../config/db.js";
import connection from "../config/redis.js";
import Job from "../models/Job.js";
import { generateReport } from "../services/reportService.js";
import { logThroughput } from "../services/throughputLogger.js";
import { emitJobEvent } from "../utils/socket.js";
import {
  registerWorker,
  updateHeartbeat,
} from "./heartbeat.js";

await connectDB();
let processedJobs = 0;
let failedJobs = 0;
const startTime = Date.now();

const reportWorker = new Worker(
  "reportQueue",
  async (job) => {
    const { dbJobId } = job.data;
    await Job.findByIdAndUpdate(dbJobId, { status: "processing", startedAt: new Date() });
    
    const reportPath = await generateReport(job.data);
    
    await Job.findByIdAndUpdate(dbJobId, { 
        status: "completed", 
        completedAt: new Date(), 
        result: { reportPath } 
    });
    return { success: true };
  },
  { connection, concurrency: 2 }
);

// reportWorker.on("completed", async (job) => {
//   await logThroughput("completed");
//   emitJobEvent("stats:update", { jobId: job.id, status: "completed" });
// });









await registerWorker("report-worker");
import os from "os";

setInterval(() => {
  const memory =
    (
      (os.totalmem() -
        os.freemem()) /
      os.totalmem()
    ) * 100;

  updateHeartbeat(
    "report-worker",
    {
      cpu: Math.floor(
        Math.random() * 60
      ),
      memory: Math.round(memory),
      processed: processedJobs,
      failed: failedJobs,
      uptime: Math.floor(
        (Date.now() - startTime) /
          1000
      ),
    }
  );
}, 5000);





reportWorker.on("completed", async (job) => {
  processedJobs++;
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

// reportWorker.on("failed", async (job, err) => {
//   await Job.findByIdAndUpdate(job.data.dbJobId, { status: "failed", error: err.message, completedAt: new Date() });
//   emitJobEvent("stats:update", { jobId: job.id, status: "failed" });
// });


reportWorker.on("failed", async (job, err) => {
  failedJobs++;
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



