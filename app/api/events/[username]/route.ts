import { connectMongoDB } from "@/libs/mongodb";
import Events from "@/models/Events";
import { NextResponse } from "next/server";
import User from "@/models/User";
import mongoose from "mongoose";
import crypto from "crypto";

// Public route
// Get event by id
export async function GET(request: Request) {
  const slug = request.url.split("/")[3];
  await connectMongoDB();
  const event = await Events.findOne({ slug });
  if (!event) {
    return NextResponse.json({ message: "No event found" }, { status: 404 });
  }
  return NextResponse.json({ event }, { status: 200 });
}

function generateToken(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(characters.length);
    token += characters[randomIndex];
  }
  return token;
}

export async function POST(request: Request) {
  await connectMongoDB();
  const token = request.headers.get("Authorization");
  if (!token) {
    return NextResponse.json({ message: "Not Authorized!" }, { status: 401 });
  }

  const user = await User.findOne({ username: request.url.split("/")[5] });
  if (!user) {
    return NextResponse.json({ message: "No user found" }, { status: 404 });
  }

  if (user.role !== "organizer") {
    return NextResponse.json(
      { message: "User is not an organizer" },
      { status: 401 }
    );
  }

  try {
    const data = await request.json();
    const userId = data?.userId;

    const {
      title,
      description,
      image,
      date,
      location,
      coordinates,
      attendees,
    } = data;

    const organizerId = new mongoose.Types.ObjectId(userId);

    if (!title || !date || !location || !userId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const eventExists = await Events.findOne({ title });
    if (eventExists) {
      return NextResponse.json(
        { message: "Event already exists" },
        { status: 400 }
      );
    }

    const token = generateToken(10);
    const event = await Events.create({
      title,
      description,
      image,
      date,
      location,
      coordinates,
      organizer: organizerId,
      attendees,
      token,
    });
    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    console.error("Error creating event: ", error);
    return NextResponse.json(
      { message: "Error creating event" },
      { status: 500 }
    );
  }
}
