import { db } from "@/db";
import { eq, sql } from "drizzle-orm";
import { events as Event } from "@/models/Events";
import { NextResponse } from "next/server";
import { users as User } from "@/models/User";
import crypto from "crypto";

// Public route
// Get event by id
export async function GET(request: Request) {
  const slug = request.url.split("/")[3];
  const [event] = await db.select().from(Event).where(eq(Event._id, slug));
  if (!event) {
    return NextResponse.json({ message: "No event found" }, { status: 404 });
  }
  return NextResponse.json({ event }, { status: 200 });
}

function generateToken(length: number) {
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
  const username = request.url.split("/")[5];
  const userId = request.headers.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "Not Authorized!" }, { status: 401 });
  }

  const [user] = await db.select().from(User).where(eq(User.username, username));

  if (!user || user._id !== userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 404 });
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
      link
    } = data;

    const organizerId = user._id;

    if (!title || !date || !location || !userId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (userId !== user._id) {
      return NextResponse.json(
        { message: "User not authorized to create event" },
        { status: 401 }
      );
    }

    // Check if event already exists by title
    const [eventExists] = await db.select().from(Event).where(eq(Event.title, title));
    if (eventExists) {
      return NextResponse.json(
        { message: "Event already exists" },
        { status: 400 }
      );
    }

    const token = generateToken(10);

    // remove quotes from coordinates
    if (coordinates) {
      coordinates.lat = parseFloat(coordinates?.lat) || 0;
      coordinates.lng = parseFloat(coordinates?.lng) || 0;
    }

    const [event] = await db.insert(Event).values({
      title,
      description,
      image,
      date,
      location,
      token,
      link,
      coordinates: coordinates || { lat: 0, lng: 0 },
      organizer: organizerId,
      attendees,
    }).returning();

    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    console.error("Error creating event: ", error);
    return NextResponse.json(
      { message: "Error creating event" },
      { status: 500 }
    );
  }
}
