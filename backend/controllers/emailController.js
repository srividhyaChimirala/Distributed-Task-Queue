// import Job from "../models/Job.js";
// import { emailQueue } from "../queues/emailQueue.js";

// export const sendEmail = async (req, res) => {
//     try {

//         const { email, subject, message } = req.body;

//         // Save initial job in DB
//         const newJob = await Job.create({
//             queueName: "emailQueue",
//             data: {
//                 email,
//                 subject,
//                 message,
//             },
//             status: "pending",
//         });

//         // Add job to BullMQ queue with retry configuration
//         const job = await emailQueue.add(
//             "sendEmailJob",
//             {
//                 dbJobId: newJob._id,
//                 email,
//                 subject,
//                 message,
//             },
//             {
//                 attempts: 3,
//                 backoff: {
//                     type: "exponential",
//                     delay: 2000,
//                 },
//                 removeOnComplete: 100,
//                 removeOnFail: 50,
//             }
//         );

//         // Save BullMQ jobId
//         newJob.jobId = job.id;
//         await newJob.save();

//         res.status(200).json({
//             success: true,
//             message: "Email job added to queue",
//             job: newJob,
//         });

//     } catch (error) {

//         res.status(500).json({
//             success: false,
//             error: error.message,
//         });

//     }
// };








import Job from "../models/Job.js";
import { emailQueue } from "../queues/emailQueue.js";

export const sendEmail = async (req, res) => {
  try {
    const { email, subject, message } = req.body;
console.log("REQ.USER =", req.user);
    // Make sure route is protected by auth middleware
    const userId = req.user.userId;

    // Create DB job record
    // const newJob = await Job.create({
    //   user: userId,
    //   queueName: "emailQueue",
    //   data: {
    //     email,
    //     subject,
    //     message,
    //   },
    //   status: "pending",
    //   createdAt: new Date(),
    // });
    const newJob = await Job.create({
  userId: userId,
  queueName: "emailQueue",
  data: {
    email,
    subject,
    message,
  },
  status: "pending",
  createdAt: new Date(),
});

    console.log("QUEUE USER =", userId);

    // Add BullMQ job
    const job = await emailQueue.add(
      "sendEmailJob",
      {
        dbJobId: newJob._id.toString(),
        userId,
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

    // Save BullMQ Job ID
    newJob.jobId = job.id;
    await newJob.save();

    res.status(200).json({
      success: true,
      message: "Email job added to queue",
      job: newJob,
    });

  } catch (error) {
    console.error("Send Email Error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};