import { Worker } from "bullmq";
import IORedis from "ioredis";
import Job from "../models/Job.js";
import { sendEmail } from "../services/emailService.js";
import deadLetterQueue from "../queues/deadLetterQueue.js";

const connection = new IORedis({
    maxRetriesPerRequest: null,
});

const worker = new Worker(
    "emailQueue",

    async (job) => {

        const {
            dbJobId,
            email,
            subject,
            message,
        } = job.data;

        try {

            console.log(
                `PID ${process.pid} started Email Job ${job.id}`
            );

            await Job.findByIdAndUpdate(
                dbJobId,
                {
                    status: "processing",
                    startedAt: new Date(),
                }
            );

            console.log(
                `PID ${process.pid} sending email to ${email}`
            );

            const emailResult = await sendEmail(
                email,
                subject,
                message
            );

            console.log(
                `PID ${process.pid} completed Email Job ${job.id}`
            );

            await Job.findByIdAndUpdate(
                dbJobId,
                {
                    status: "completed",
                    completedAt: new Date(),

                    result: {
                        email,
                        subject,
                        messageId: emailResult.messageId,
                        accepted: emailResult.accepted,
                        response: emailResult.response,
                    },
                }
            );

            return {
                success: true,
            };

        } catch (error) {

            console.error(
                `PID ${process.pid} failed Email Job ${job.id}`
            );

            console.error(error);

            // BullMQ will automatically retry
            throw error;
        }
    },

    {
        connection,
        concurrency: 5,
    }
);


// ======================
// COMPLETED EVENT
// ======================

worker.on("completed", (job) => {

    console.log(
        `PID ${process.pid} COMPLETED Job ${job.id}`
    );

});


// ======================
// FAILED EVENT
// ======================

worker.on("failed", async (job, err) => {

    console.log(
        `PID ${process.pid} FAILED Job ${job?.id}`
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
            `Job ${job.id} permanently failed`
        );

        try {

            // Move permanently failed jobs to DLQ
            await deadLetterQueue.add(
                "failedEmailJob",
                {
                    originalJobId: job.id,
                    data: job.data,
                    error: err.message,
                    failedAt: new Date(),
                    attemptsMade: job.attemptsMade,
                }
            );

            console.log(
                `Job ${job.id} moved to Dead Letter Queue`
            );

        } catch (dlqError) {

            console.error(
                `Failed to move Job ${job.id} to DLQ`
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
                    completedAt: new Date(),
                }
            );

        } catch (dbError) {

            console.error(
                `Failed updating MongoDB for Job ${job.id}`
            );

            console.error(dbError);
        }
    }
});


// ======================
// STALLED EVENT
// ======================

worker.on("stalled", (jobId) => {

    console.warn(
        `Email Job ${jobId} stalled and will be retried by BullMQ`
    );

});


// ======================
// WORKER ERROR EVENT
// ======================

worker.on("error", (err) => {

    console.error(
        `PID ${process.pid} WORKER ERROR`
    );

    console.error(err);

});


// ======================
// GRACEFUL SHUTDOWN
// ======================

const shutdown = async (signal) => {

    console.log(
        `Received ${signal}. Closing Email Worker...`
    );

    try {

        await worker.close();

        console.log(
            "Email Worker closed successfully"
        );

        process.exit(0);

    } catch (error) {

        console.error(
            "Error while closing Email Worker"
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
    `Email Worker Running - PID ${process.pid}`
);