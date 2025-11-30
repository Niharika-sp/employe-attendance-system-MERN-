import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["employee", "manager"], default: "employee" },
    employeeId: { type: String, required: true, unique: true },
    department: { type: String },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export default mongoose.model("User", schema);
