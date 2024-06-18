import { db } from "@/db";
import { users as User } from "@/models/User";
import { posts as Post, CommentType } from "@/models/Post";
import { eq, like, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  const query = req.nextUrl.searchParams.get("q") || null;

  try {

    const userId = req.headers.get("userId");

    if (!query || query === "") {
      return NextResponse.json({ message: "No search query provided!" });
    }

    if (!userId) {
      return NextResponse.json({ message: "User not authenticated!" });
    }

    const userResults = await db
      .select({
        _id: User._id,
        image: User.image,
        followers: User.followers,
        username: User.username,
        name: User.name
      })
      .from(User)
      .where(
        or(
          like(User.name, `%${query}%`),
          like(User.username, `%${query}%`)
        ))
      .limit(5);

    const postResults = await db
      .select({
        _id: Post._id,
        userImg: User.image,
        username: User.username,
        name: User.name,
        content: Post.content,
        likes: Post.likes,
        comments: Post.comments,
        authorID: Post.authorID,
        url: Post.url || "",
        createdAt: Post.createdAt,
        updatedAt: Post.updatedAt
      })
      .from(Post)
      .leftJoin(User, eq(Post.authorID, User._id))
      .where(
          like(Post.content, `%${query}%`),
        )
      .limit(15);

    // respond with JSON
    return NextResponse.json({ userResults, postResults });

  } catch (error) {
    console.error("Error fetching users and posts: ", error);
    return NextResponse.json({ message: "Error fetching users and posts from database!" });
  }
}