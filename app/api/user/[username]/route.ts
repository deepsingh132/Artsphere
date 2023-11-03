import { connectMongoDB } from "@/libs/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

// Public route
export async function GET(request: Request) {
  // get username from request params
  const username = request.url.split("/")[5];
  await connectMongoDB();
  const user = await User.findOne({ username });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "User found", user }, { status: 200 });
}

export async function PUT(request: Request) {
  // get username from request params
  const username = request.url.split("/")[5];
  await connectMongoDB();
  const user = await User.findOne({ username });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  user.role = "organizer";
  await user.save();
  return NextResponse.json({ message: "User updated", user }, { status: 200 });
}
