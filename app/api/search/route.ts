import { db } from "@/db";
import { users as User } from "@/models/User";
import { eq, like, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  const query = req.nextUrl.searchParams.get("search") || null;

  try {
    // this is an auto complete search query that searches for posts and users
    const results = await db
      .select({
        _id: User._id,
        userImg: User.image,
        username: User.username,
        name: User.name
      })
      .from(User)
      .where(
        or(
          like(User.name, `%${query}%`),
          like(User.username, `%${query}%`)
        ))
      .limit(8);
    // respond with JSON
    return NextResponse.json({ results });

  } catch (error) {
    console.error("Error fetching posts: ", error);
    return NextResponse.json({ message: "Error fetching posts from database!" });
  }
}