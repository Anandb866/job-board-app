import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Application from "@/models/Application";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Login to apply" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };

    if (decoded.role === "admin") {
      return NextResponse.json(
        { error: "Admins cannot apply for jobs" },
        { status: 403 },
      );
    }

    await connectDB();
    const {
      jobId,
      fullName,
      email,
      phone,
      education,
      experience,
      resumeLink,
      coverNote,
    } = await req.json();

    const existing = await Application.findOne({ userId: decoded.id, jobId });
    if (existing) {
      return NextResponse.json(
        { error: "You have already applied to this job" },
        { status: 409 },
      );
    }

    const application = await Application.create({
      userId: decoded.id,
      jobId,
      fullName,
      email,
      phone,
      education,
      experience,
      resumeLink,
      coverNote,
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
