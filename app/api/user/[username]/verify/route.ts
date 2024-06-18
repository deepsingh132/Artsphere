import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users as User } from "@/models/User";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  // get username from request params
  const username = request.url.split("/")[5];
  const [user] = await db.select().from(User).where(eq(User.username, username));

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const { userId } = await request.json();
  if (user._id.toString() !== userId) {
    return NextResponse.json(
      { message: "You are not authorized to perform this action" },
      { status: 401 }
    );
  }

  user.verified = true;
  await db.update(User).set(user).where(eq(User.username, username));
  return NextResponse.json({ message: "User updated", user }, { status: 200 });
}
