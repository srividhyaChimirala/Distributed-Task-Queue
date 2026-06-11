import { Queue } from "bullmq";
import connection from "../config/redis.js";

export const emailQueue = new Queue(
  "emailQueue",
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