import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Application from "@/models/Application";
import jwt from "jsonwebtoken";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      role: string;
    };
    if (decoded.role !== "admin")
      return NextResponse.json({ error: "Admins only" }, { status: 403 });

    await connectDB();
    const { status } = await req.json();
    const app = await Application.findByIdAndUpdate(
      params.id,
      { status },
      { new: true },
    );
    return NextResponse.json({ application: app });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
