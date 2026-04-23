import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Application from "@/models/Application";
import jwt from "jsonwebtoken";

// GET /api/applications — get current user's applications
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };
    await connectDB();

    // admin gets all applications, user gets only their own
    const query = decoded.role === "admin" ? {} : { userId: decoded.id };

    const applications = await Application.find(query)
      .populate("jobId", "title company location salary")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ applications });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
