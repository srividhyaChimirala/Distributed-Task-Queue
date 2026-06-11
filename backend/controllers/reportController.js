import reportQueue from "../queues/reportQueue.js";
import Job from "../models/Job.js";

export const generateReportController = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const dbJob = await Job.create({
      queueName: "reportQueue",
      data: {
        title,
        content,
      },
      status: "pending",
    });

    const job = await reportQueue.add(
      "reportGenerationJob",
      {
        dbJobId: dbJob._id,
        title,
        content,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      }
    );

    dbJob.jobId = job.id;
    await dbJob.save();

    res.status(200).json({
      success: true,
      message: "Report Job Added Successfully",
      jobId: job.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};