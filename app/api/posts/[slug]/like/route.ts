import { db } from "@/db";
import { posts as Post, PostType } from "@/models/Post";
import { users as User, UserType } from "@/models/User";
import { UUID } from "crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Private route handle post update
export async function PUT(request: Request) {
  const postId = request.url.split("/")[5] as UUID;
  const userId = request.headers.get("userId") as UUID;

  if (!postId || !userId) {
    return NextResponse.json({ message: "Unauthorised" }, { status: 400 });
  }

  const [post] = await db.select().from(Post).where(eq(Post._id, postId));
  const [user] = await db.select().from(User).where(eq(User._id, userId));

  if (!post || !user) {
    return NextResponse.json(
      { message: "Post or user not found" },
      { status: 404 }
    );
  }

  // if post.likes is null, set it to an empty array
  post.likes = post.likes || [];
  user.likes = user.likes || [];

  const postLikeIndex = post.likes?.indexOf(userId)
  const userLikeIndex = user.likes?.indexOf(postId)

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

async function removeLike(post: PostType, postLikeIndex: number, user: UserType, userLikeIndex: number) {
  post.likes?.splice(postLikeIndex, 1);
  user.likes?.splice(userLikeIndex, 1);

  await Promise.all([
    db.update(Post).set({ likes: post.likes }).where(eq(Post._id, post._id)),
    db.update(User).set({ likes: user.likes }).where(eq(User._id, user._id)),
  ]);
}

async function addLike(post: PostType, userId: UUID, user: UserType, postId: UUID) {
  post.likes?.push(userId);
  user.likes?.push(postId);

  await Promise.all([
    db.update(Post).set({ likes: post.likes }).where(eq(Post._id, post._id)),
    db.update(User).set({ likes: user.likes }).where(eq(User._id, user._id)),
  ]);
}
