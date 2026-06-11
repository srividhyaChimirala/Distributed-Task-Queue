import { Queue, QueueEvents } from "bullmq";
import connection from "../config/redis.js";

const deadLetterQueue = new Queue(
    "dead-letter",
    {
        connection,

        defaultJobOptions: {
            removeOnComplete: false,
            removeOnFail: false,
        },
    }
);

const deadLetterQueueEvents =
    new QueueEvents(
        "dead-letter",
        { connection }
    );

deadLetterQueueEvents.on(
    "waiting",
    ({ jobId }) => {

        console.log(
            `[DLQ] Job ${jobId} added`
        );

    }
);

deadLetterQueueEvents.on(
    "failed",
    ({ jobId, failedReason }) => {

        console.error(
            `[DLQ] Job ${jobId} failed`
        );

        console.error(
            failedReason
        );

    }
);

console.log(
    "Dead Letter Queue initialized"
);

export default deadLetterQueue;