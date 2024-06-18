import { db } from "@/db";
import { Post, posts } from "@/models/Post";
import { users } from "@/models/User";
import { UUID, randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Public route
export async function GET(request: Request) {
  const postId = request.url.split("/")[5];

  const validUUID = postId?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

  // early return if no postId or postId is not a valid UUID
  if (!postId || !validUUID) {
    return NextResponse.json({ message: "Invalid post ID" }, { status: 404 });
  }

  const [post] = await db.select({
    _id: posts._id,
    userImg: users.image,
    username: users.username,
    name: users.name,
    content: posts.content,
    authorID: posts.authorID,
    comments: posts.comments,
    category: posts.category,
    likes: posts.likes,
    url: posts.url,
    createdAt: posts.createdAt,
    updatedAt: posts.updatedAt,
  }).from(posts).fullJoin(users, eq(posts.authorID, users._id)).where(eq(posts._id, postId));

  if (!post) {
    return NextResponse.json({ message: "No posts found" }, { status: 404 });
  }
  return NextResponse.json({ post: post }, { status: 200 });
}

// Private route handle post delete
export async function DELETE(request: Request) {
  const postId = request.url.split("/")[5];
  const userId = request.headers.get("userId");

  const [post] = await db.select().from(posts).where(eq(posts._id, postId))

  if (!post) {
    return NextResponse.json({ message: "No posts found" }, { status: 404 });
  }

  // Check if the user is the author of the post
  if (post?.authorID !== userId) {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  try {
    await db.delete(posts).where(eq(posts._id, postId));
    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting post: ", error);
    return NextResponse.json({ message: "Error deleting post" }, { status: 500 });
  }
}
