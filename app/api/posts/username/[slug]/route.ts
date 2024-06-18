import { db } from "@/db";
import { eq } from "drizzle-orm";
import { posts as Posts } from "@/models/Post";
import { NextResponse } from "next/server";
import { users } from "@/models/User";

// Public route
export async function GET(request: Request) {
  // get username from request params
  const username = request.url.split("/")[6];

  const posts = await db.select({
    _id: Posts._id,
    userImg: users.image,
    username: users.username,
    name: users.name,
    content: Posts.content,
    authorID: Posts.authorID,
    comments: Posts.comments,
    category: Posts.category,
    likes: Posts.likes,
    url: Posts.url,
    createdAt: Posts.createdAt,
    updatedAt: Posts.updatedAt,
  })
    .from(Posts)
    .leftJoin(users, eq(Posts.authorID, users._id))
    .where(eq(users.username, username));
  if (!posts) {
    return NextResponse.json({ message: "No posts found" }, { status: 404 });
  }
  return NextResponse.json({ posts: posts }, { status: 200 });
}
