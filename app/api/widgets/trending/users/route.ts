import { db } from "@/db";
import { users as User } from "@/models/User";
import { desc, gte } from "drizzle-orm";
import { NextResponse } from "next/server";
import moment from "moment";

/**
 * TODO: Scale the trending users route for production
 */

// Public route
export async function GET(request: Request) {
  try {
    // Calculate the timestamp for 24 hours ago
    const twentyFourHoursAgo = moment().subtract(24, "hours").toDate();

    // Query users who received new followers in the last 24 hours
    const users = await db.select()
      .from(User)
      .where(gte(User.updatedAt, twentyFourHoursAgo))
      .orderBy(desc(User.followers))
      .limit(10);

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