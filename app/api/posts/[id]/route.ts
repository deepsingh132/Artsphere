import { connectMongoDB } from "@/libs/mongodb";
import Post from "@/models/Post";
import { NextResponse } from "next/server";

// Public route
export async function GET(request: Request) {
  const postId = request.url.split("/")[5];

  await connectMongoDB();
  const post = await Post.findOne({ _id: postId });

  if (!post) {
    return NextResponse.json({ message: "No posts found" }, { status: 404 });
  }
  return NextResponse.json({ post: post }, { status: 200 });
}

// Private route handle post delete
export async function DELETE(request: Request) {
  const postId = request.url.split("/")[5];
  const userId = request.headers.get("userId");

  await connectMongoDB();

  const post = await Post.findOne({ _id: postId });
  if (!post) {
    return NextResponse.json({ message: "No posts found" }, { status: 404 });
  }

  // Check if the user is the author of the post
  if (post?.authorID !== userId) {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  // Delete the post from the database
  await post.deleteOne({ _id: postId });

  return NextResponse.json({ message: "Post deleted" }, { status: 200 });
}
