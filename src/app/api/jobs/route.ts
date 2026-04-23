import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
import jwt from "jsonwebtoken";

// GET /api/jobs — list jobs with search + filter
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const city = searchParams.get("city") || "";
    const category = searchParams.get("category") || "";
    const workMode = searchParams.get("workMode") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;

    const query: any = { isActive: true };

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { company: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    if (city) query.city = { $regex: city, $options: "i" };
    if (category) query.category = { $regex: category, $options: "i" };
    if (workMode) query.workMode = workMode;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      jobs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

// POST /api/jobs — admin creates a job
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      role: string;
    };
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Admins only" }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();
    const job = await Job.create(body);

    return NextResponse.json({ job }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
