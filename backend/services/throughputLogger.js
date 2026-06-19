
// import { ThroughputStat } from "../models/ThroughputStat.js";

// export async function logThroughput(type) {
//   const now = new Date();

// const hourString = new Date(now.setMinutes(0, 0, 0)).toISOString();
//   const update =
//     type === "completed"
//       ? { $inc: { completed: 1 } }
//       : { $inc: { failed: 1 } };

//   await ThroughputStat.findOneAndUpdate(
//     { hourString },
//     {
//       $setOnInsert: {
//         timestamp: now,
//         hourString,
//         completed: 0,
//         failed: 0,
//       },
//       ...update,
//     },
//     { upsert: true, new: true }
//   );
// }






// import { ThroughputStat } from "../models/ThroughputStat.js";
// import { emitJobEvent } from "../utils/socket.js"; // Use the helper, not io

// export async function logThroughput(type) {
//   const now = new Date();
  
//   // Normalize date to the top of the current hour
//   const hourString = new Date(now.setMinutes(0, 0, 0)).toISOString();
//   const update = type === "completed" ? { $inc: { completed: 1 } } : { $inc: { failed: 1 } };

//   try {
//     await ThroughputStat.findOneAndUpdate(
//       { hourString },
//       {
//         // $setOnInsert: {
//         //   timestamp: new Date(hourString),
//         //   hourString,
//         //   completed: 0,
//         //   failed: 0,
//         // },
//         $setOnInsert: {
//   timestamp: new Date(hourString),
//   hourString,
// },
//         ...update,
//       },
//       { upsert: true, returnDocument: "after" }
//     );

//     // 🚀 CRITICAL: Tell the frontend dashboard to update automatically 
//     // using the decoupled helper
//     emitJobEvent("stats:update");
    
//   } catch (error) {
//     console.error("Error logging throughput updates:", error);
//   }
// }












import { ThroughputStat } from "../models/ThroughputStat.js";
import { emitJobEvent } from "../utils/socket.js";

export async function logThroughput(type, userId) {
  try {
    if (!userId) {
      console.warn(
        `logThroughput called without userId. Type: ${type}`
      );
      return;
    }

    const now = new Date();

    // Round down to the start of the current hour
    const hourString = new Date(
      now.setMinutes(0, 0, 0)
    ).toISOString();

    const update =
      type === "completed"
        ? { $inc: { completed: 1 } }
        : { $inc: { failed: 1 } };

    const stat = await ThroughputStat.findOneAndUpdate(
      {
        userId,
        hourString,
      },
      {
        $setOnInsert: {
          userId,
          timestamp: new Date(hourString),
          hourString,
          completed: 0,
          failed: 0,
        },
        ...update,
      },
      {
        upsert: true,
        new: true,
      }
    );

    // Notify dashboard clients
    emitJobEvent("stats:update", {
      userId,
      type,
      hourString,
      completed: stat.completed,
      failed: stat.failed,
      timestamp: Date.now(),
    });

  } catch (error) {
    console.error(
      "Error logging throughput updates:",
      error
    );
  }
}