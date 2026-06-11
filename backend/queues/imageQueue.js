import { Queue } from "bullmq";
import connection from "../config/redis.js";

export const imageQueue = new Queue(
  "imageQueue",
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