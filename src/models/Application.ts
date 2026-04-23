import mongoose, { Schema, models } from "mongoose";

const ApplicationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    status: {
      type: String,
      enum: ["applied", "reviewed", "shortlisted", "rejected"],
      default: "applied",
    },
    fullName: { type: String },
    email: { type: String },
    phone: { type: String },
    education: { type: String },
    experience: { type: String },
    resumeLink: { type: String },
    coverNote: { type: String },
  },
  { timestamps: true },
);

const Application =
  models.Application || mongoose.model("Application", ApplicationSchema);
export default Application;
