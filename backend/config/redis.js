// import IORedis from "ioredis";

// const connection = new IORedis({
//   host: "127.0.0.1",
//   port: 6379,
//   maxRetriesPerRequest: null,
// });

// export default connection





// import IORedis from "ioredis";

// const connection = process.env.REDIS_URL
//   ? new IORedis(process.env.REDIS_URL)
//   : new IORedis({
//       host: process.env.REDIS_HOST || "127.0.0.1",
//       port: process.env.REDIS_PORT || 6379,
//       maxRetriesPerRequest: null,
//     });

// export default connection;








// import IORedis from "ioredis";

// console.log("REDIS_URL exists:", !!process.env.REDIS_URL);
// console.log("REDIS_HOST:", process.env.REDIS_HOST);

// const connection = process.env.REDIS_URL
//   ? new IORedis(process.env.REDIS_URL)
//   : new IORedis({
//       host: process.env.REDIS_HOST || "127.0.0.1",
//       port: process.env.REDIS_PORT || 6379,
//       maxRetriesPerRequest: null,
//     });

// export default connection;






import IORedis from "ioredis";

console.log("REDIS_URL exists:", !!process.env.REDIS_URL);

const connection = process.env.REDIS_URL
  ? new IORedis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    })
  : new IORedis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: process.env.REDIS_PORT || 6379,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });

connection.on("connect", () => {
  console.log("Redis connected");
});

connection.on("error", (err) => {
  console.error("Redis error:", err.message);
});

export default connection;
