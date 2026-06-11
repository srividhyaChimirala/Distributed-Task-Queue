import { Queue } from "bullmq";
import connection from "../config/redis.js";

export const reportQueue = new Queue(
  "reportQueue",
  {
    connection,

    defaultJobOptions: {
      attempts: 3,

      backoff: {
        type: "exponential",
        delay: 2000,
      },

      removeOnComplete: 100,
      removeOnFail: 50,
    },
  }
);