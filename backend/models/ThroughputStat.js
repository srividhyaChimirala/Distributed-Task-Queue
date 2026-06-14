import mongoose from "mongoose";

const throughputStatSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now, index: true },
  hourString: { type: String, required: true }, // e.g., "14:00"
  completed: { type: Number, default: 0 },
  failed: { type: Number, default: 0 }
});

export const ThroughputStat = mongoose.model("ThroughputStat", throughputStatSchema);