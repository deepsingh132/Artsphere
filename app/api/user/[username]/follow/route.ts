import { connectMongoDB } from "@/libs/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

const followUser = async (followFromUser: any, followToUser: any) => {
  await User.updateOne(
    { _id: followFromUser._id },
    { $push: { following: followToUser._id } }
  );
  await User.updateOne(
    { _id: followToUser._id },
    { $push: { followers: followFromUser._id } }
  );
  return NextResponse.json({ message: "User followed" }, { status: 200 });
}

const unFollowUser = async (followFromUser: any, followToUser: any) => {
  await User.updateOne(
    { _id: followFromUser._id },
    { $pull: { following: followToUser._id } }
  );
  await User.updateOne(
    { _id: followToUser._id },
    { $pull: { followers: followFromUser._id } }
  );
  return NextResponse.json({ message: "User unfollowed" }, { status: 200 });
}

export async function PUT(request: Request) {
  const { action, followFrom, followTo } = await request.json();

  const token = request.headers.get("Authorization");

  if (action !== "follow") {
    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ message: "Not Authorized!" }, { status: 401 });
  }

  await connectMongoDB();
  // find both users
  const followFromUser = await User.findOne({ _id: followFrom });
  const followToUser = await User.findOne({ _id: followTo });

  if (!followFromUser || !followToUser) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }
  // check if the user is already following the other user
  const isUserFollowing = followFromUser?.following?.includes(followToUser._id);
  const isUserFollowedBy = followToUser?.followers?.includes(followFromUser._id);

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
