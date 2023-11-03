import { connectMongoDB } from "@/libs/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  // get username from request params
  const username = request.url.split("/")[5];
  await connectMongoDB();
  const user = await User.findOne({ username });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const { userId } = await request.json();
  if (user._id.toString() !== userId) {
    return NextResponse.json(
      { message: "You are not authorized to perform this action" },
      { status: 401 }
    );
  }

  user.verified = true;
  await user.save();
  return NextResponse.json({ message: "User updated", user }, { status: 200 });
}
