import { connectMongoDB } from "@/libs/mongodb";
import Events from "@/models/Events";
import { NextResponse } from "next/server";
import User from "@/models/User";
import mongoose from "mongoose";

// Private route
export async function POST(request: Request) {
  const body = await request.json();

  const { userId, eventId, token } = body;

  const accesstoken = request.headers.get("Authorization");
  if (!token || !accesstoken) {
    return NextResponse.json({ message: "Not Authorized!" }, { status: 401 });
  }

  await connectMongoDB();

  // check if the user exists
  const user = await User.findById(userId);
  // check if the user is already in the event using the event id and the user id
  const isUserInEvent = await Events.findOne({
    _id: eventId,
    attendees: {
      $elemMatch:
      {
        userId: new mongoose.Types.ObjectId(userId),
      }
    },
  });

  // check if the token is valid
  const event = await Events.findById(eventId);
  if (!event || !user) {
    return NextResponse.json(
      { message: "Event or user not found" },
      { status: 404 }
    );
  }

  if (event?.token !== token) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  // if user is already in the event, return a message with the event code
  if (isUserInEvent) {
    return NextResponse.json(
      {
        message: "User already in the event",
        code: isUserInEvent.attendees[0]?.code,
      },
      { status: 201 }
    );
  }

  try {
    // create a code for the user to join the event
    const code = new mongoose.Types.ObjectId().toString();
    const updatedEvent = await Events.findByIdAndUpdate(
      eventId,
      {
        $push: { attendees: { userId: userId, code: code } },
      },
      { new: true }
    );

    if (updatedEvent) {
      return NextResponse.json(
        { message: "User added to the event", code: code },
        { status: 200 }
      );
    }
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
