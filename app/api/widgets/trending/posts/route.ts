import { connectMongoDB } from "@/libs/mongodb";
import { NextResponse } from "next/server";
import Post from "@/models/Post";
import moment from "moment";

// Public route
// Get the 10 most popular posts in the last 24 hours
export async function GET(request: Request) {
  await connectMongoDB();

  // Calculate the timestamp for 24 hours ago
  const twentyFourHoursAgo = moment().subtract(24, "hours").toDate();

  try {
    // Query posts created in the last 24 hours
    const posts = await Post.find({
      createdAt: { $gte: twentyFourHoursAgo },
    });

    // if no posts or less than 3 posts, return the most recent 10 posts
    if (!posts || posts.length < 3) {
      const trendingPosts = await Post.find({
        // where content is not empty and content length is not greater than 50
        content: { $ne: "" },
        $expr: { $lt: [{ $strLenCP: "$content" }, 50] },
      }).sort({ createdAt: -1 }).limit(10);
      return NextResponse.json({ trendingPosts }, { status: 200 });
    }

    // Sort the posts by the total number of likes and comments combined
    posts.sort((postA, postB) => {
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

