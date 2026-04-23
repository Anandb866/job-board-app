import mongoose, { Schema, models } from "mongoose";

const JobSchema = new Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    salary: { type: String, required: true },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    experience: { type: String, required: true },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },
    workMode: {
      type: String,
      enum: ["On-site", "Remote", "Hybrid"],
      default: "On-site",
    },
    category: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    initials: { type: String },
    color: { type: String },
    bg: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Job = models.Job || mongoose.model("Job", JobSchema);
export default Job;
