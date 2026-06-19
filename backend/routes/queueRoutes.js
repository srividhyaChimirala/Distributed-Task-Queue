
import express from "express";
import { emailQueue } from "../queues/emailQueue.js";
import { imageQueue } from "../queues/imageQueue.js";
import { reportQueue } from "../queues/reportQueue.js";
import { protect } from "../middleware/auth.js";
import connection from "../config/redis.js";

// import { ThroughputStat } from "../models/ThroughputStat.js";
import Job from "../models/Job.js";
const router = express.Router();

// 1. Existing endpoint for dashboard stats
// router.get("/stats", async (req, res) => {
//   try {
//     const [emailCounts, imageCounts, reportCounts] = await Promise.all([
//       emailQueue.getJobCounts(),
//       imageQueue.getJobCounts(),
//       reportQueue.getJobCounts(),
//     ]);

//     res.json({
//       email: emailCounts,
//       image: imageCounts,
//       report: reportCounts,
//       // ... keep mock throughput if needed
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching stats", error: error.message });
//   }
// // });
// router.get("/stats", async (req, res) => {
//   try {
//     const [emailCounts, imageCounts, reportCounts] =
//       await Promise.all([
//         emailQueue.getJobCounts(),
//         imageQueue.getJobCounts(),
//         reportQueue.getJobCounts(),
//       ]);

//     // Last 24 hours throughput
//     const last24h = new Date();
//     last24h.setHours(last24h.getHours() - 24);

//     const throughputStats =
//       await ThroughputStat.find({
//         timestamp: { $gte: last24h }
//       }).sort({ timestamp: 1 });

//     const throughput = throughputStats.map(item => ({
//       hour: new Date(item.timestamp)
//         .getHours()
//         .toString()
//         .padStart(2, "0"),

//       completed: item.completed || 0,
//       failed: item.failed || 0,
//     }));

//     const maxCompleted = Math.max(
//       ...throughput.map(t => t.completed),
//       10
//     );

//     res.json({
//       email: emailCounts,
//       image: imageCounts,
//       report: reportCounts,

//       throughput,

//       graphCeiling:
//         Math.ceil(maxCompleted / 10) * 10,

//       totalThroughputPerMin:
//         throughput.length > 0
//           ? throughput[
//               throughput.length - 1
//             ].completed
//           : 0,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error fetching stats",
//       error: error.message,
//     });
//   }
// });
// router.get("/stats",protect, async (req, res) => {
//     console.log("REQ.USER =", req.user);

//     const jobs = await Job.find({
//   userId: req.user.userId,
// });

// console.log("Current User:", req.user.userId);
// console.log("Jobs for user:", jobs.length);
//   try {
//     // const [emailCounts, imageCounts, reportCounts, workerRegistry] = await Promise.all([
//     //   emailQueue.getJobCounts(),
//     //   imageQueue.getJobCounts(),
//     //   reportQueue.getJobCounts(),
//     //   // Fetch the heartbeat registry from Redis
//     //   req.redis.hgetall("worker_registry") 
//     // ]);



//     const userId = req.user.userId;

// const emailCounts = {
//   waiting: await Job.countDocuments({
//     userId,
//     queueName: "email",
//     status: "pending",
//   }),

//   active: await Job.countDocuments({
//     userId,
//     queueName: "email",
//     status: "processing",
//   }),

//   completed: await Job.countDocuments({
//     userId,
//     queueName: "email",
//     status: "completed",
//   }),

//   failed: await Job.countDocuments({
//     userId,
//     queueName: "email",
//     status: "failed",
//   }),
// };

// const imageCounts = {
//   waiting: await Job.countDocuments({
//     userId,
//     queueName: "image",
//     status: "pending",
//   }),

//   active: await Job.countDocuments({
//     userId,
//     queueName: "image",
//     status: "processing",
//   }),

//   completed: await Job.countDocuments({
//     userId,
//     queueName: "image",
//     status: "completed",
//   }),

//   failed: await Job.countDocuments({
//     userId,
//     queueName: "image",
//     status: "failed",
//   }),
// };

// const reportCounts = {
//   waiting: await Job.countDocuments({
//     userId,
//     queueName: "report",
//     status: "pending",
//   }),

//   active: await Job.countDocuments({
//     userId,
//     queueName: "report",
//     status: "processing",
//   }),

//   completed: await Job.countDocuments({
//     userId,
//     queueName: "report",
//     status: "completed",
//   }),

//   failed: await Job.countDocuments({
//     userId,
//     queueName: "report",
//     status: "failed",
//   }),
// };



//     // Calculate active workers (if heartbeat is less than 15 seconds old)
//     const now = Date.now();
//     const activeWorkers = workerRegistry 
//       ? Object.values(workerRegistry).filter(ts => (now - parseInt(ts)) < 15000).length
//       : 0;

//     // ... (Your existing throughput logic remains the same)
//     const last24h = new Date();
// last24h.setHours(last24h.getHours() - 24);

// // const throughputStats = await ThroughputStat.find({
// //   timestamp: { $gte: last24h }
// // }).sort({ timestamp: 1 });

// const throughputStats = await ThroughputStat.find({
//   userId: req.user.userId,
//   timestamp: { $gte: last24h },
// });


// // const recentTasks = await Job.find()
// //   .sort({ createdAt: -1 })
// //   .limit(10)
// //   .lean();

// const recentTasks = await Job.find({
//   userId: req.user.userId,
// })
//   .sort({ createdAt: -1 })
//   .limit(10)
//   .lean();



// const throughput = throughputStats.map(item => ({
//   hour: new Date(item.timestamp).getHours().toString().padStart(2, "0"),
//   completed: item.completed || 0,
//   failed: item.failed || 0,
// }));

// const maxCompleted = Math.max(...throughput.map(t => t.completed), 10);
// res.json({
//   email: emailCounts,
//   image: imageCounts,
//   report: reportCounts,
//   activeWorkers: `${activeWorkers}/4`,
//   throughput,
//   graphCeiling: Math.ceil(maxCompleted / 10) * 10,
//   totalThroughputPerMin:
//     throughput.length > 0
//       ? throughput[throughput.length - 1].completed
//       : 0,

//   recentTasks: recentTasks.map(j => ({
//     id: j._id,
//     title: j.data?.subject || j.data?.title || "Untitled Task",
//     type: j.data?.type || "unknown",
//     // status: j.status?.toUpperCase() || "PROCESSING",
//     status:
//   j.status
//     ? j.status.toUpperCase()
//     : j.finishedOn
//       ? "COMPLETED"
//       : j.failedReason
//         ? "FAILED"
//         : "PROCESSING",
//     // timestamp: j.createdAt || j.timestamp,
//     timestamp: j.createdAt || j.timestamp || Date.now(),
//     ms: j.duration ? `${j.duration} ms` : "—",
//     w: j.worker || "—"
//   }))
// });

// } catch (error) {
//   res.status(500).json({ message: "Error fetching stats", error: error.message });
// }
// });
router.get("/stats", protect, async (req, res) => {
  try {
    const userId = req.user.userId;

    // =====================================================
    // EMAIL COUNTS
    // =====================================================
    const emailCounts = {
      waiting: await Job.countDocuments({
        userId,
        queueName: "emailQueue",
        status: "pending",
      }),
      active: await Job.countDocuments({
        userId,
        queueName: "emailQueue",
        status: "processing",
      }),
      completed: await Job.countDocuments({
        userId,
        queueName: "emailQueue",
        status: "completed",
      }),
      failed: await Job.countDocuments({
        userId,
        queueName: "emailQueue",
        status: "failed",
      }),
    };

    // =====================================================
    // IMAGE COUNTS
    // =====================================================
    const imageCounts = {
      waiting: await Job.countDocuments({
        userId,
        queueName: "imageQueue",
        status: "pending",
      }),
      active: await Job.countDocuments({
        userId,
        queueName: "imageQueue",
        status: "processing",
      }),
      completed: await Job.countDocuments({
        userId,
        queueName: "imageQueue",
        status: "completed",
      }),
      failed: await Job.countDocuments({
        userId,
        queueName: "imageQueue",
        status: "failed",
      }),
    };

    // =====================================================
    // REPORT COUNTS
    // =====================================================
    const reportCounts = {
      waiting: await Job.countDocuments({
        userId,
        queueName: "reportQueue",
        status: "pending",
      }),
      active: await Job.countDocuments({
        userId,
        queueName: "reportQueue",
        status: "processing",
      }),
      completed: await Job.countDocuments({
        userId,
        queueName: "reportQueue",
        status: "completed",
      }),
      failed: await Job.countDocuments({
        userId,
        queueName: "reportQueue",
        status: "failed",
      }),
    };

    // =====================================================
    // ACTIVE WORKERS
    // =====================================================
    const workerRegistry =
      (await req.redis?.hgetall("worker_registry")) || {};

    const now = Date.now();
const workers = Object.entries(workerRegistry).map(
  ([name, timestamp]) => ({
    name,
    online: now - Number(timestamp) < 15000,
    lastHeartbeat: Number(timestamp),
  })
);

const activeWorkersCount = workers.filter(
  (w) => w.online
).length;
    // =====================================================
    // THROUGHPUT FROM JOBS COLLECTION
    // =====================================================
    const last24h = new Date();
    last24h.setHours(last24h.getHours() - 24);

    const completedJobs = await Job.find({
      userId,
      status: "completed",
      updatedAt: { $gte: last24h },
    }).lean();

    const failedJobs = await Job.find({
      userId,
      status: "failed",
      updatedAt: { $gte: last24h },
    }).lean();

    const hourlyMap = {};

    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0");

      hourlyMap[hour] = {
        hour,
        completed: 0,
        failed: 0,
      };
    }

    completedJobs.forEach((job) => {
      const hour = new Date(
        job.updatedAt || job.createdAt
      )
        .getHours()
        .toString()
        .padStart(2, "0");

      hourlyMap[hour].completed += 1;
    });

    failedJobs.forEach((job) => {
      const hour = new Date(
        job.updatedAt || job.createdAt
      )
        .getHours()
        .toString()
        .padStart(2, "0");

      hourlyMap[hour].failed += 1;
    });

    const throughput = Object.values(hourlyMap);

// Remove empty hours
const filteredThroughput = throughput.filter(
  (t) => t.completed > 0 || t.failed > 0
);

const chartThroughput =
  filteredThroughput.length > 0
    ? filteredThroughput
    : throughput;

const maxCompleted = Math.max(
  ...chartThroughput.map((t) =>
    Math.max(t.completed, t.failed)
  ),
  10
);

    // =====================================================
    // RECENT TASKS
    // =====================================================
    const recentTasks = await Job.find({
      userId,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
console.log("THROUGHPUT DATA");
console.table(chartThroughput);




res.json({
      email: emailCounts,
      image: imageCounts,
      report: reportCounts,
      workers,

      activeWorkers: `${activeWorkersCount}/4`,

      throughput: chartThroughput,

      graphCeiling: Math.ceil(maxCompleted / 10) * 10,

      totalThroughputPerMin:
        throughput.reduce(
          (sum, item) => sum + item.completed,
          0
        ) || 0,

      recentTasks: recentTasks.map((j) => ({
        id: j._id,
        title:
          j.data?.subject ||
          j.data?.title ||
          "Untitled Task",

        type: j.queueName || "unknown",

        status: j.status
          ? j.status.toUpperCase()
          : "PROCESSING",

        timestamp: j.createdAt || Date.now(),

        ms: j.duration
          ? `${j.duration} ms`
          : "—",

        w: j.worker || "—",
      })),
    });
  } catch (error) {
    console.error("STATS ROUTE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
//
//  // ✅ THIS MUST EXIST

// 2. Endpoint to receive task submissions
// router.post("/submit", async (req, res) => {
//   const { taskType, title, metadata } = req.body;
//   try {
//     const queueMap = { mail: emailQueue, image: imageQueue, file: reportQueue };
//     const selectedQueue = queueMap[taskType];
    
//     if (!selectedQueue) return res.status(400).json({ success: false, message: "Invalid task type" });

//     const job = await selectedQueue.add(`${taskType}-job`, {
//       title: title || `${taskType.toUpperCase()} Pipeline Execution`,
//       ...metadata
//     });

//     res.status(201).json({ success: true, jobId: job.id });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });
router.post("/submit",protect, async (req, res) => {
  const { taskType, title, metadata } = req.body;

  try {
    // UPDATED: Keys now match the frontend state exactly ('email', 'image', 'report')
    const queueMap = {
      email: emailQueue, 
      image: imageQueue,
      report: reportQueue,
    };

    const selectedQueue = queueMap[taskType];

    if (!selectedQueue) {
      console.error(`Submission failed: No queue found for type "${taskType}"`);
      return res.status(400).json({
        success: false,
        message: `Invalid task type: ${taskType}. Use 'email', 'image', or 'report'.`,
      });
    }

    // Create Mongo job first
    // const newJob = await Job.create({
    //   queueName: selectedQueue.name,
    //   data: metadata,
    //   status: "pending",
    // });
const newJob = await Job.create({
  userId: req.user.userId,
  queueName: selectedQueue.name,
  data: metadata,
  status: "pending",
});
    // Add to BullMQ with REAL Mongo ID
    // const job = await selectedQueue.add(
    //   `${taskType}-job`,
    //   {
    //     dbJobId: newJob._id,
    //     title: title || `${taskType.toUpperCase()} Pipeline Execution`,
    //     ...metadata,
    //   }
    // );

    const job = await selectedQueue.add(
  `${taskType}-job`,
  {
    dbJobId: newJob._id,
    userId: req.user.userId,
    title: title || `${taskType.toUpperCase()} Pipeline Execution`,
    ...metadata,
  }
);

    // Save BullMQ job id
    newJob.jobId = job.id;
    await newJob.save();

    res.status(201).json({
      success: true,
      jobId: job.id,
    });
  } catch (error) {
    console.error("❌ Submission Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
// 3. NEW: Diagnostic Routes for QueueMonitor
const allQueues = [
  { name: "Email", instance: emailQueue },
  { name: "Image", instance: imageQueue },
  { name: "Report", instance: reportQueue }
];

// router.get("/tasks", async (req, res) => {
//   try {
//     let allTasks = [];
//     for (const q of allQueues) {
//       const jobs = await q.instance.getJobs(['active', 'completed', 'failed', 'waiting', 'delayed']);
//       const formatted = jobs.map(j => ({
//         id: j.id,
//         name: j.data?.title || j.name || "Untitled Task",
//         type: q.name,
//         status: j.failedReason ? "FAILED" : (j.finishedOn ? "COMPLETED" : "PROCESSING"),
//         worker: j.data?.workerName || j.returnvalue?.workerName || "—",
//         created: new Date(j.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//       }));
//       allTasks.push(...formatted);
//     }
//     res.json(allTasks);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch tasks" });
//   }
// });
// Replace your /api/tasks route with this to ensure data consistency
router.get("/tasks", protect, async (req, res) => {
  try {
    // Fetch from all queues
    const jobs = await Promise.all([
      emailQueue.getJobs(['completed', 'failed', 'active']),
      imageQueue.getJobs(['completed', 'failed', 'active']),
      reportQueue.getJobs(['completed', 'failed', 'active'])
    ]);

    // Flatten and format
    // const allTasks = jobs.flat().map(j => ({
    //   id: j.id,
    //   title: j.data?.title || "Untitled Task",
    //   type: j.queue.name,
    //   status: j.failedReason ? "FAILED" : (j.finishedOn ? "COMPLETED" : "PROCESSING"),
    //   timestamp: j.timestamp
    // })).sort((a, b) => b.timestamp - a.timestamp);
    const userId = req.user.userId;

const allTasks = jobs
  .flat()
  .filter(job => job.data?.userId === userId)
  .map(j => ({
    id: j.id,
    title: j.data?.title || "Untitled Task",
    type: j.queue.name,
    status: j.failedReason
      ? "FAILED"
      : j.finishedOn
      ? "COMPLETED"
      : "PROCESSING",
    timestamp: j.timestamp,
  }))
  .sort((a, b) => b.timestamp - a.timestamp);

    res.json(allTasks); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/task/:id/retry", async (req, res) => {
  try {
    for (const q of allQueues) {
      const job = await q.instance.getJob(req.params.id);
      if (job) { await job.retry(); return res.json({ success: true }); }
    }
    res.status(404).json({ error: "Task not found" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post("/task/:id/delete", async (req, res) => {
  try {
    for (const q of allQueues) {
      const job = await q.instance.getJob(req.params.id);
      if (job) { await job.remove(); return res.json({ success: true }); }
    }
    res.status(404).json({ error: "Task not found" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});



// router.get("/workers", async (req, res) => {
//   try {
//     const registry =
//       await connection.hgetall("worker_registry");

//     const now = Date.now();

//     const workers = Object.entries(registry).map(
//       ([name, timestamp]) => ({
//         name,
//         status:
//           now - Number(timestamp) < 15000
//             ? "ONLINE"
//             : "OFFLINE",
//         lastHeartbeat: Number(timestamp),
//       })
//     );

//     res.json(workers);
//   } catch (error) {
//     res.status(500).json({
//       error: error.message,
//     });
//   }
// });





router.get("/workers", async (req, res) => {
  try {
    const registry =
      await connection.hgetall(
        "worker_registry"
      );

    const now = Date.now();

    const workers = Object.entries(
      registry
    ).map(([name, timestamp]) => ({
      name,
      status:
        now - Number(timestamp) < 15000
          ? "ONLINE"
          : "OFFLINE",
      lastHeartbeat: Number(timestamp),
    }));

    res.json(workers);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to load workers",
    });
  }
});








router.get("/queue/all",protect, async (req, res) => {
  try {
    const [emailJobs, imageJobs, reportJobs] = await Promise.all([
      emailQueue.getJobs(['completed', 'failed', 'active', 'waiting'], 0, 50),
      imageQueue.getJobs(['completed', 'failed', 'active', 'waiting'], 0, 50),
      reportQueue.getJobs(['completed', 'failed', 'active', 'waiting'], 0, 50)
    ]);

    // Map them with explicit type assignment
    const formattedEmail = emailJobs.map(j => ({ ...j, type: 'email' }));
    const formattedImage = imageJobs.map(j => ({ ...j, type: 'image' }));
    const formattedReport = reportJobs.map(j => ({ ...j, type: 'report' }));

    // const allTasks = [...formattedEmail, ...formattedImage, ...formattedReport]
    //   .sort((a, b) => b.timestamp - a.timestamp)
    //   .map(job => ({
    //     id: job.id,
    //     title: job.data?.title || "Untitled Task",
    //     type: job.type, // Now coming from our manual assignment
    //     status: job.failedReason ? "FAILED" : (job.finishedOn ? "COMPLETED" : "PROCESSING"),
    //     timestamp: job.timestamp
    //   }));
const userId = req.user.userId;

const allTasks = [...formattedEmail, ...formattedImage, ...formattedReport]
  .filter(job => job.data?.userId === userId)
  .sort((a, b) => b.timestamp - a.timestamp)
  .map(job => ({
    id: job.id,
    title: job.data?.title || "Untitled Task",
    type: job.type,
    status: job.failedReason
      ? "FAILED"
      : job.finishedOn
      ? "COMPLETED"
      : "PROCESSING",
    timestamp: job.timestamp,
  }));


    res.status(200).json(allTasks);
  } catch (error) {
    console.error("❌ Error fetching full queue:", error);
    res.status(500).json({ success: false, error: "Failed to load queue" });
  }
});

router.get("/clear-workers", async (req, res) => {
  await connection.del(
    "worker_registry"
  );

  res.json({
    success: true,
  });
});







export default router;