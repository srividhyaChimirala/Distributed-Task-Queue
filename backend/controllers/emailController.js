import Job from "../models/Job.js";
import { emailQueue } from "../queues/emailQueue.js";

export const sendEmail = async (req, res) => {
    try {

        const { email, subject, message } = req.body;

        // Save initial job in DB
        const newJob = await Job.create({
            queueName: "emailQueue",
            data: {
                email,
                subject,
                message,
            },
            status: "pending",
        });

        // Add job to BullMQ queue with retry configuration
        const job = await emailQueue.add(
            "sendEmailJob",
            {
                dbJobId: newJob._id,
                email,
                subject,
                message,
            },
            {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 2000,
                },
                removeOnComplete: 100,
                removeOnFail: 50,
            }
        );

        // Save BullMQ jobId
        newJob.jobId = job.id;
        await newJob.save();

        res.status(200).json({
            success: true,
            message: "Email job added to queue",
            job: newJob,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message,
        });

    }
};