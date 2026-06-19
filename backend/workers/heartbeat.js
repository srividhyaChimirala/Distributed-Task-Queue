import connection from "../config/redis.js";

// // Call this function inside your worker's initialization
// export const registerWorker = async (workerName) => {
//   const now = Date.now();
//   // Register worker in a Redis Hash with a timestamp
//   await connection.hset("worker_registry", workerName, now);
// };

// // Call this periodically (every 5-10 seconds)
// export const updateHeartbeat = async (workerName) => {
//   await connection.hset("worker_registry", workerName, Date.now());
// };


export const registerWorker = async (workerName) => {
  const now = Date.now();

  await connection.hset(
    "worker_registry",
    workerName,
    now
  );

  console.log("REGISTERED:", workerName);
};

export const updateHeartbeat = async (workerName) => {
  const now = Date.now();

  await connection.hset(
    "worker_registry",
    workerName,
    now
  );

  console.log("HEARTBEAT:", workerName, now);
};