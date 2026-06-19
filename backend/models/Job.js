// import mongoose from "mongoose";

// const jobSchema = new mongoose.Schema(
//     {   
//         userId: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "User",
//   required: true,
// },

//         queueName: {
//             type: String,
//             required: true,
//             trim: true,
//         },
        

//         jobId: {
//             type: String,
//             default: null,
//         },

//         data: {
//             type: Object,
//             required: true,
//         },

//         status: {
//             type: String,
//             enum: [
//                 "pending",
//                 "processing",
//                 "completed",
//                 "failed",
//             ],
//             default: "pending",
//         },

//         result: {
//             type: Object,
//             default: null,
//         },

//         error: {
//             type: String,
//             default: null,
//         },

//         // Number of retry attempts made by BullMQ
//         attemptsMade: {
//             type: Number,
//             default: 0,
//         },

//         // Worker process that handled the job
//         workerId: {
//             type: String,
//             default: null,
//         },

//         // When processing started
//         startedAt: {
//             type: Date,
//             default: null,
//         },

//         // When processing completed successfully
//         completedAt: {
//             type: Date,
//             default: null,
//         },

//         // When processing permanently failed
//         failedAt: {
//             type: Date,
//             default: null,
//         },
//     },
//     {
//         timestamps: true,
//     }
// );

// export default mongoose.model("Job", jobSchema);








import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    queueName: {
      type: String,
      required: true,
      trim: true,
    },

    jobId: {
      type: String,
      default: null,
    },

    data: {
      type: Object,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "completed",
        "failed",
      ],
      default: "pending",
      index: true,
    },

    result: {
      type: Object,
      default: null,
    },

    error: {
      type: String,
      default: null,
    },

    attemptsMade: {
      type: Number,
      default: 0,
    },

    workerId: {
      type: String,
      default: null,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    failedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Job", jobSchema);