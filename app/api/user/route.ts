import { connectMongoDB } from "@/libs/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();
  const username = email.split("@")[0];
  await connectMongoDB();
  const user = await User.create({ email, username });
  return NextResponse.json({ message: "User created", user }, { status: 201 });
}

export async function GET(request: Request) {
  const { username } = await request.json();
  await connectMongoDB();
  try {
    const user = await User.findOne({ username });
    return NextResponse.json({ message: "User found", user }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
}
