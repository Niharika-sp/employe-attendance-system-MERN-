import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    checkInTime: { type: Date },
    checkOutTime: { type: Date },
    status: { type: String, enum: ["present", "absent", "late", "half-day"] },
    totalHours: { type: Number },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

schema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", schema);

