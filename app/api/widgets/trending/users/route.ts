import { connectMongoDB } from "@/libs/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import moment from "moment";


export async function GET(request: Request) {
  await connectMongoDB();
  try {
    // Calculate the timestamp for 24 hours ago
    const twentyFourHoursAgo = moment().subtract(24, "hours").toDate();

    // Query users who received new followers in the last 24 hours
    const users = await User.find({
      updatedAt: { $gte: twentyFourHoursAgo },
    });

    // Sort the users by the number of new followers they received
    users.sort((userA, userB) => {
      const newFollowersA =
        userA.followersCount - userA.followersCountAtLastUpdate;
      const newFollowersB =
        userB.followersCount - userB.followersCountAtLastUpdate;
      return newFollowersB - newFollowersA;
    });

    // Get the top 10 users
    const topUsers = users.slice(0, 10);

    return NextResponse.json({ topUsers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching trending users:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending users" },
      { status: 500 }
    );
  }
}