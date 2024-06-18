import { db } from "@/db";
import { posts as Posts } from "@/models/Post";
import { users } from "@/models/User";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  const type = req.nextUrl.searchParams.get("type") || null;

  try {

      const posts = await db
        .select({
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

    if (type) {
      const filteredPosts = posts.filter((post) => post.category === type);
      return NextResponse.json({ posts: filteredPosts });
    }

    return NextResponse.json({ posts }); // respond with JSON
  } catch (error) {
    console.error("Error fetching posts: ", error);
    return NextResponse.json({ message: "Error fetching posts from database!" });
  }
}

// Private route, handle post creation
export async function POST(req: NextRequest) {
  try {
    const { _id, content, authorID, category, url } = await req.json();

    if (!_id || !authorID || !category) {
      return NextResponse.json({ message: "Missing required fields!" }, { status: 400 });
    }

    await db.insert(Posts).values({
      _id,
      content,
      authorID,
      category,
      url,
    });

    return NextResponse.json({ message: "success"});
  } catch (error) {
    console.error("Error creating post: ", error);
    return NextResponse.json({ message: "error: ", error });
  }
}
