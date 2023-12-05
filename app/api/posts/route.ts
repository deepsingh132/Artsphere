import { connectMongoDB } from "@/libs/mongodb";
import Post from "../../../models/Post";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const type = req.nextUrl.searchParams.get("type") || null;

    if (type) {
      const posts = await Post.find({ category: type });
      return NextResponse.json({ posts });
    }

    const posts = await Post.find({}); // fetch data from the source
    return NextResponse.json({ posts }); // respond with JSON
  } catch (error) {
    console.error("Error fetching posts: ", error);
    return NextResponse.json({ message: "Error fetching posts from MongoDB!" });
  }
}

// Private route, handle post creation
export async function POST(req) {
  try {
    const { _id, username, name, userImg, content, authorID, category, url } =
      await req.json();
    await connectMongoDB();
    const res = await Post.create({
      _id,
      username,
      name,
      userImg,
      content,
      authorID,
      category,
      url,
    });
    return NextResponse.json({ message: "success", post: res });
  } catch (error) {
    console.error("Error creating post: ", error);
    return NextResponse.json({ message: "error: ", error });
  }
}
