import { Worker } from "bullmq";
import connection from "../config/redis.js";
import Job from "../models/Job.js";
import { generateReport } from "../services/reportService.js";
import deadLetterQueue from "../queues/deadLetterQueue.js";

const reportWorker = new Worker(
    "reportQueue",

    async (job) => {

        const { dbJobId } = job.data;

        try {

            console.log(
                `PID ${process.pid} started Report Job ${job.id}`
            );

            await Job.findByIdAndUpdate(
                dbJobId,
                {
                    status: "processing",
                    startedAt: new Date(),
                    workerId: `PID-${process.pid}`,
                }
            );

            const reportPath =
                await generateReport(job.data);

            await Job.findByIdAndUpdate(
                dbJobId,
                {
                    status: "completed",
                    completedAt: new Date(),

                    result: {
                        reportPath,
                    },
                }
            );

            console.log(
                `PID ${process.pid} completed Report Job ${job.id}`
            );

            return {
                success: true,
                reportPath,
            };

        } catch (error) {

            console.error(
                `PID ${process.pid} failed Report Job ${job.id}`
            );

            console.error(error);

            // Allow BullMQ retry mechanism
            throw error;
        }
    },

    {
        connection,
        concurrency: 2,
    }
);


// ======================
// COMPLETED EVENT
// ======================

reportWorker.on("completed", (job) => {

    console.log(
        `PID ${process.pid} COMPLETED Report Job ${job.id}`
    );

});


// ======================
// FAILED EVENT
// ======================

reportWorker.on(
    "failed",
    async (job, err) => {

        console.log(
            `PID ${process.pid} FAILED Report Job ${job?.id}`
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
                `Report Job ${job.id} permanently failed`
            );

            try {

                await deadLetterQueue.add(
                    "failedReportJob",
                    {
                        originalJobId: job.id,
                        data: job.data,
                        error: err.message,
                        failedAt: new Date(),
                        attemptsMade: job.attemptsMade,
                    }
                );

                console.log(
                    `Report Job ${job.id} moved to Dead Letter Queue`
                );

            } catch (dlqError) {

                console.error(
                    "Failed to move Report Job to DLQ"
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

reportWorker.on(
    "stalled",
    (jobId) => {

        console.warn(
            `Report Job ${jobId} stalled and will be retried`
        );

    }
);


// ======================
// WORKER ERROR EVENT
// ======================

reportWorker.on(
    "error",
    (err) => {

        console.error(
            `PID ${process.pid} REPORT WORKER ERROR`
        );

        console.error(err);

    }
);


// ======================
// GRACEFUL SHUTDOWN
// ======================

const shutdown = async (signal) => {

    console.log(
        `Received ${signal}. Closing Report Worker...`
    );

    try {

        await reportWorker.close();

        console.log(
            "Report Worker closed successfully"
        );

        process.exit(0);

    } catch (error) {

        console.error(
            "Error while closing Report Worker"
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
    `Report Worker Running - PID ${process.pid}`
);

export default reportWorker;