import { db } from "@/db";
import {users as User} from "@/models/User";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Public route
export async function GET(request: Request) {
  // get username from request params
  const username = request.url.split("/")[5];
  const [user] = await db.select().from(User).where(eq(User.username, username));
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "User found", user }, { status: 200 });
}

export async function PUT(request: Request) {
  // get username from request params
  const username = request.url.split("/")[5];
  const [user] = await db.select().from(User).where(eq(User.username, username));
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  // update user
  user.role = "organizer";
  await db.update(User).set(user).where(eq(User.username, username));
  return NextResponse.json({ message: "User updated", user }, { status: 200 });
}
