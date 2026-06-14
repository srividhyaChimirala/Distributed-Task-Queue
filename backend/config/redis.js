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








import IORedis from "ioredis";

console.log("REDIS_URL exists:", !!process.env.REDIS_URL);
console.log("REDIS_HOST:", process.env.REDIS_HOST);

const connection = process.env.REDIS_URL
  ? new IORedis(process.env.REDIS_URL)
  : new IORedis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: process.env.REDIS_PORT || 6379,
      maxRetriesPerRequest: null,
    });

export default connection;
