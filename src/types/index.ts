export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  city: string;
  salary: string;
  salaryMin: number;
  salaryMax: number;
  experience: string;
  jobType: "Full-time" | "Part-time" | "Contract" | "Internship";
  workMode: "On-site" | "Remote" | "Hybrid";
  category: string;
  description: string;
  requirements: string[];
  logoInitials: string;
  logoColor: string;
  logoBg: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "superadmin";
  createdAt: string;
}
