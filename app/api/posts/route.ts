import { connectMongoDB } from "@/libs/mongodb";
import Post from "../../../models/Post";
import { NextResponse } from "next/server";


export async function GET() {
  await connectMongoDB();
  const posts = await Post.find({}); // fetch data from the source
  return NextResponse.json({ posts }); // respond with JSON
}

// Private route, handle post creation
export async function POST(req) {
  try {
    const { username, name, userImg, content, authorID, category, url } = await req.json();
    await connectMongoDB();
    const res = await Post.create({ username, name, userImg, content, authorID, category, url });
    return NextResponse.json({ message: "success", post: res });
    } catch (error) {
      console.error("Error creating post: ", error);
      return NextResponse.json({ message: "error: ", error });
    }
}
