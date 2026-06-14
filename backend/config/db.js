import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB Connection Error:", error.message);

    process.exit(1);
  }
};

export default connectDB;





// import mongoose from "mongoose";

// export const connectDB = async () => {
//   const uri = process.env.MONGO_URI;

//   console.log("MONGO_URI exists:", !!uri);

//   if (!uri) throw new Error("MONGO_URI not defined");

//   await mongoose.connect(uri);

//   console.log("MongoDB connected");
// };
