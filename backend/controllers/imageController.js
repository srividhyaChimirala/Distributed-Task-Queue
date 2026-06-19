import { imageQueue } from "../queues/imageQueue.js";
import Job from "../models/Job.js";

export const processImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    // const dbJob = await Job.create({
    //   queueName: "imageQueue",
    //   data: {
    //     imagePath: req.file.path,
    //   },
    //   status: "pending",
    // });
    const dbJob = await Job.create({
  userId: req.user.userId,
  queueName: "imageQueue",
  data: {
    imagePath: req.file.path,
  },
  status: "pending",
});

    // const job = await imageQueue.add(
    //   "imageProcessingJob",
    //   {
    //     dbJobId: dbJob._id,
    //     imagePath: req.file.path,
    //   },
    const job = await imageQueue.add(
  "imageProcessingJob",
  {
    dbJobId: dbJob._id,
    userId: req.user.userId,
    imagePath: req.file.path,
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
      message: "Image Job Added Successfully",
      jobId: job.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
