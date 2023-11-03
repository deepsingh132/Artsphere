import { connectMongoDB } from "@/libs/mongodb";
import Post from "@/models/Post";
import { NextResponse } from "next/server";

// Public route
export async function GET(request: Request) {
  // get username from request params
  const username = request.url.split("/")[6];

  await connectMongoDB();
  const posts = await Post.find({ username });
  if (!posts) {
    return NextResponse.json({ message: "No posts found" }, { status: 404 });
  }
  return NextResponse.json({ posts: posts }, { status: 200 });
}
