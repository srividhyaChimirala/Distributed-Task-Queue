import { Worker } from "bullmq";
import connection from "../config/redis.js";
import Job from "../models/Job.js";
import { processImage } from "../services/imageService.js";
import deadLetterQueue from "../queues/deadLetterQueue.js";

const imageWorker = new Worker(
    "imageQueue",

    async (job) => {

        const { dbJobId } = job.data;

        try {

            console.log(
                `PID ${process.pid} started Image Job ${job.id}`
            );

            await Job.findByIdAndUpdate(
                dbJobId,
                {
                    status: "processing",
                    startedAt: new Date(),
                    workerId: `PID-${process.pid}`,
                }
            );

            const processedImage =
                await processImage(job.data);

            await Job.findByIdAndUpdate(
                dbJobId,
                {
                    status: "completed",
                    completedAt: new Date(),

                    result: {
                        processedImage,
                    },
                }
            );

            console.log(
                `PID ${process.pid} completed Image Job ${job.id}`
            );

            return {
                success: true,
                processedImage,
            };

        } catch (error) {

            console.error(
                `PID ${process.pid} failed Image Job ${job.id}`
            );

            console.error(error);

            // Allow BullMQ retries
            throw error;
        }
    },

    {
        connection,
        concurrency: 3,
    }
);


// ======================
// COMPLETED EVENT
// ======================

imageWorker.on("completed", (job) => {

    console.log(
        `PID ${process.pid} COMPLETED Image Job ${job.id}`
    );

});


// ======================
// FAILED EVENT
// ======================

imageWorker.on(
    "failed",
    async (job, err) => {

        console.log(
            `PID ${process.pid} FAILED Image Job ${job?.id}`
        );

        console.log(
            `Attempts Made: ${job?.attemptsMade}`
        );

        console.log(
            `Max Attempts: ${job?.opts?.attempts}`
        );

        console.error(
            `Failure Reason: ${err.message}`
        );

        if (
            job &&
            job.attemptsMade === job.opts.attempts
        ) {

            console.log(
                `Image Job ${job.id} permanently failed`
            );

            try {

                await deadLetterQueue.add(
                    "failedImageJob",
                    {
                        originalJobId: job.id,
                        data: job.data,
                        error: err.message,
                        failedAt: new Date(),
                        attemptsMade: job.attemptsMade,
                    }
                );

                console.log(
                    `Image Job ${job.id} moved to Dead Letter Queue`
                );

            } catch (dlqError) {

                console.error(
                    "Failed to move Image Job to DLQ"
                );

                console.error(dlqError);
            }

            try {

                await Job.findByIdAndUpdate(
                    job.data.dbJobId,
                    {
                        status: "failed",
                        error: err.message,
                        attemptsMade: job.attemptsMade,
                        failedAt: new Date(),
                    }
                );

            } catch (dbError) {

                console.error(
                    "Failed updating MongoDB"
                );

                console.error(dbError);
            }
        }
    }
);


// ======================
// STALLED EVENT
// ======================

imageWorker.on(
    "stalled",
    (jobId) => {

        console.warn(
            `Image Job ${jobId} stalled and will be retried`
        );

    }
);


// ======================
// WORKER ERROR EVENT
// ======================

imageWorker.on(
    "error",
    (err) => {

        console.error(
            `PID ${process.pid} IMAGE WORKER ERROR`
        );

        console.error(err);

    }
);


// ======================
// GRACEFUL SHUTDOWN
// ======================

const shutdown = async (signal) => {

    console.log(
        `Received ${signal}. Closing Image Worker...`
    );

    try {

        await imageWorker.close();

        console.log(
            "Image Worker closed successfully"
        );

        process.exit(0);

    } catch (error) {

        console.error(
            "Error while closing Image Worker"
        );

        console.error(error);

        process.exit(1);
    }
};

process.on(
    "SIGINT",
    () => shutdown("SIGINT")
);

process.on(
    "SIGTERM",
    () => shutdown("SIGTERM")
);


// ======================
// STARTUP LOG
// ======================

console.log(
    `Image Worker Running - PID ${process.pid}`
);

export default imageWorker;