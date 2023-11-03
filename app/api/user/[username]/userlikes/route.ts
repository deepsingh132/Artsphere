import { connectMongoDB } from "@/libs/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

// Public route
export async function GET(request: Request) {
  const username = request.url.split("/")[5];
  await connectMongoDB();
  //only get the likes array from the user dont get the id
  const likedPosts = await User.find({ username }, { likes: 1, _id: 0 });

  if (!likedPosts) {
    return NextResponse.json({ message: "No posts found" }, { status: 404 });
  }
  return NextResponse.json({ posts: likedPosts }, { status: 200 });
}
