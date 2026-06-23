// import connection from "../config/redis.js";




// export const registerWorker = async (workerName) => {
//   const now = Date.now();

//   await connection.hset(
//     "worker_registry",
//     workerName,
//     now
//   );

//   console.log("REGISTERED:", workerName);
// };

// export const updateHeartbeat = async (workerName) => {
//   const now = Date.now();

//   await connection.hset(
//     "worker_registry",
//     workerName,
//     now
//   );

//   console.log("HEARTBEAT:", workerName, now);
// };

















import os from "os";
import connection from "../config/redis.js";

// export const registerWorker = async (
//   workerName
// ) => {
//   await connection.hset(
//     "worker_registry",
//     workerName,
//     Date.now()
//   );
// };
export const registerWorker = async (
  workerName
) => {
  await connection.hset(
    "worker_registry",
    workerName,
    JSON.stringify({
      workerName,
      cpu: 0,
      memory: 0,
      processed: 0,
      failed: 0,
      uptime: 0,
      lastHeartbeat: Date.now(),
    })
  );
};

export const updateHeartbeat = async (
  workerName,
  stats = {}
) => {
  await connection.hset(
    "worker_registry",
    workerName,
    JSON.stringify({
      workerName,
      cpu: stats.cpu || 0,
      memory: stats.memory || 0,
      processed: stats.processed || 0,
      failed: stats.failed || 0,
      uptime: stats.uptime || 0,
      lastHeartbeat: Date.now(),
    })
  );
};