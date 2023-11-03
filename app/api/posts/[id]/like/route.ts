import { connectMongoDB } from "@/libs/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { NextResponse } from "next/server";

// Private route handle post update
export async function PUT(request: { url: string; json: () => any; }) {
  const postId = request.url.split("/")[5];
  const data = await request.json();
  const userId = data?.userId;

  if (!postId || !userId) {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }

  await connectMongoDB();
  const post = await Post.findOne({ _id: postId });
  const user = await User.findOne({ _id: userId });

  if (!post || !user) {
    return NextResponse.json(
      { message: "Post or user not found" },
      { status: 404 }
    );
  }

  const postLikeIndex = post.likes.indexOf(userId);
  const userLikeIndex = user.likes.indexOf(postId);

  if (postLikeIndex > -1 && userLikeIndex > -1) {
    await removeLike(post, postLikeIndex, user, userLikeIndex);
  } else {
    await addLike(post, userId, user, postId);
  }

  return NextResponse.json(
    { message: "Like updated successfully!" },
    { status: 200 }
  );
}

async function removeLike(post: { likes: any[]; updateOne: (arg0: { likes: any; }) => any; }, postLikeIndex: any, user: { likes: any[]; updateOne: (arg0: { likes: any; }) => any; }, userLikeIndex: any) {
  post.likes.splice(postLikeIndex, 1);
  user.likes.splice(userLikeIndex, 1);

  await Promise.all([
    post.updateOne({ likes: post.likes }),
    user.updateOne({ likes: user.likes }),
  ]);
}

async function addLike(post: { likes: any[]; updateOne: (arg0: { likes: any; }) => any; }, userId: any, user: { likes: any[]; updateOne: (arg0: { likes: any; }) => any; }, postId: any) {
  post.likes.push(userId);
  user.likes.push(postId);

  await Promise.all([
    post.updateOne({ likes: post.likes }),
    user.updateOne({ likes: user.likes }),
  ]);
}
