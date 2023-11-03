import { connectMongoDB } from "@/libs/mongodb";
import Post from "@/models/Post";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


// Private route handle post update
export async function PUT(request: Request) {
  const bearer = request.headers.get("Authorization");

  if (!bearer) {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  const token = bearer.split(" ")[1];
  const data = await request.json();
  const postId = request.url.split("/")[5];
  const userId = data?.userId;

  await connectMongoDB();
  const post = await Post.findOne({ _id: postId }).lean() as any;

  if (!post) {
    return NextResponse.json({ message: "No posts found" }, { status: 404 });
  }

  const newComment = {
    _id: new mongoose.Types.ObjectId(),
    userId: userId,
    content: data.content,
    username: data.username,
    timestamp: data.timestamp,
    url: data.url,
    userImg: data.userImg,
    name: data.name,
  };

  post.comments.push(newComment);

  await Promise.all([
    Post.updateOne({ _id: postId }, { $push: { comments: newComment } }),
  ]);

  return NextResponse.json({ post: newComment }, { status: 200 });
}

export async function DELETE(request: Request) {
  const userId = request.headers.get("userId");
  const commentId = request.url.split("/")[5];

  try {
    await connectMongoDB();
    // find the comment in the post.comments array
    const post = await Post.findOne({ "comments._id": commentId });

    if (!post) {
      return NextResponse.json({ message: "No posts found" }, { status: 404 });
    }

    // check if the user is the author of the comment
    const comment = post.comments.find((comment) => {
      return comment?.userId === userId;
    });

    if (!comment) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    // delete comment from post.comments array
    const newComments = post.comments.filter((comment) => {
      return comment._id.toString() !== commentId;
    });

    await post.updateOne({ comments: newComments });

    return NextResponse.json({ post: post }, { status: 200 });
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}