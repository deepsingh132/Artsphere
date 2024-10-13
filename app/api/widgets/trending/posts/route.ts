import { db } from "@/db";
import { NextResponse } from "next/server";
import { posts as Post, PostType } from "@/models/Post";
import { eq, gte, ne, lt, and, desc } from "drizzle-orm";
import moment from "moment";


const getTrendingPosts = (posts: PostType[]) => {

  if (!posts || posts.length < 3) {
    return [];
  }

  return posts
    .filter((post) => post.content && post.content.length < 50)
    .sort((postA, postB) => {
      // if post.likes is null, set it to an empty array
      postA.likes = postA.likes || [];
      postB.likes = postB.likes || [];
      // if post.comments is null, set it to an empty array
      postA.comments = postA.comments || [];
      postB.comments = postB.comments || [];

      const scoreA = postA.likes.length + postA.comments.length;
      const scoreB = postB.likes.length + postB.comments.length;
      return scoreB - scoreA;
    })
    .slice(0, 10);
}
// Public route
// Get the 10 most popular posts in the last 24 hours
export async function GET(request: Request) {

  if (!process.env.DATABASE_URL) {
    return new NextResponse("Database connection not established.", { status: 500 });
  }

  try {
  // Calculate the timestamp for 24 hours ago
  const twentyFourHoursAgo = moment().subtract(24, "hours").toDate();

    // Query posts created in the last 24 hours
    const posts = await db
      .select()
      .from(Post)
      .where(and(gte(Post.createdAt, twentyFourHoursAgo)))

    // if no posts or less than 3 posts, return the most recent 10 posts
    if (!posts || posts.length < 3) {

      const allPosts = await db.select()
        .from(Post)
        .limit(10)
        .orderBy(desc(Post.createdAt));

     const trendingPosts = getTrendingPosts(allPosts);

      return NextResponse.json({ trendingPosts }, { status: 200 });
    }

    // Sort the posts by the total number of likes and comments combined
    posts.sort((postA, postB) => {

      postA.likes = postA.likes || [];
      postB.likes = postB.likes || [];
      postA.comments = postA.comments || [];
      postB.comments = postB.comments || [];

      const scoreA = postA.likes.length + postA.comments.length;
      const scoreB = postB.likes.length + postB.comments.length;
      return scoreB - scoreA;
    });

    // Get the top 10 posts
    const trendingPosts = posts.slice(0, 10);
    return NextResponse.json({ trendingPosts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    return new NextResponse("Error!", { status: 500 });
  }
}

