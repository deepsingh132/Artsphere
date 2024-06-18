import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users as User } from "@/models/User";
import { NextResponse } from "next/server";

const followUser = async (followFromUser: any, followToUser: any) => {
  try {
    // add the user to the following list of the user currently logged-in
    await db
      .update(User)
      .set({following: [...followFromUser.following, followToUser._id]})
      .where(eq(User._id, followFromUser._id));

    // add the logged-in user to the followers list of the user being followed
    await db
      .update(User)
      .set({ followers: [...followToUser.followers, followFromUser._id] })
      .where(eq(User._id, followToUser._id));

    return NextResponse.json({ message: "User followed" }, { status: 200 });

  } catch (error) {
    console.error("Error following user: ", error);
    return NextResponse.json({ message: "Error following user" }, { status: 500 });
  }
};

const unFollowUser = async (followFromUser: any, followToUser: any) => {

  try {
    // remove the user from the following list of the user currently logged-in
    await db.update(User)
      .set({
      following: followFromUser.following.filter(
        (id: any) => id !== followToUser._id
      ),
    }).where(eq(User._id, followFromUser._id));

    // remove the logged-in user from the followers list of the user being followed
    await db.update(User)
      .set({
      followers: followToUser.followers.filter(
        (id: any) => id !== followFromUser._id
      ),
    }).where(eq(User._id, followToUser._id));

    return NextResponse.json({ message: "User unfollowed" }, { status: 200 });
  } catch (error) {
    console.error("Error unfollowing user: ", error);
    return NextResponse.json({ message: "Error unfollowing user" }, { status: 500 });
  }
};

export async function PUT(request: Request) {
  const { action, followFrom, followTo } = await request.json();

  const userIdVerified = request.headers.get("userId");

  if (action !== "follow" || !followFrom || !followTo) {
    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  }

  if (!userIdVerified) {
    return NextResponse.json({ message: "Not Authorized!" }, { status: 401 });
  }

  // Reject the request if the user is trying to follow themself
  if (followFrom === followTo || followTo === userIdVerified ) {
    return NextResponse.json({ message: "Unable to follow yourself!"}, { status: 400 })
  }

  // find both users
  const [followFromUser] = await db
    .select()
    .from(User)
    .where(eq(User._id, followFrom));
  const [followToUser] = await db
    .select()
    .from(User)
    .where(eq(User._id, followTo));

  if (!followFromUser || !followToUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  // check if the user is already following the other user
  const isUserFollowing = followFromUser?.following?.includes(followToUser._id);
  const isUserFollowedBy = followToUser?.followers?.includes(
    followFromUser._id
  );

  // if the user is already following the other user, unfollow
  if (isUserFollowing && isUserFollowedBy) {
    return unFollowUser(followFromUser, followToUser);
  }

  // if the user is not following the other user, follow
  if (!isUserFollowing && !isUserFollowedBy) {
    return followUser(followFromUser, followToUser);
  }

  return NextResponse.json(
    { message: "Something went wrong" },
    { status: 500 }
  );
}
