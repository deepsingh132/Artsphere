import { db } from "@/db";
import { Attendees, events as Event } from "@/models/Events";
import { NextResponse } from "next/server";
import { users as User } from "@/models/User";
import { eq, and, sql, Param } from "drizzle-orm";
import { randomUUID } from "crypto";

// Private route
export async function POST(request: Request) {
  const body = await request.json();

  const { userId, eventId, token } = body;

  const userIdFromToken = request.headers.get("userId");
  if (!token || !userId || !eventId || !userIdFromToken || userId !== userIdFromToken) {
    return NextResponse.json({ message: "Not Authorized!" }, { status: 401 });
  }

  // check if the user and the event exists
  const [user] = await db.select().from(User).where(eq(User._id, userId));
  const [event] = await db.select().from(Event).where(eq(Event._id, eventId));

  if (!event || !user) {
    return NextResponse.json(
      { message: "Event or user not found" },
      { status: 404 }
    );
  }

  let attendees = event.attendees as Attendees[];

  if (!attendees) {
    attendees = [];
  }

  const isUserInEvent = attendees.find(
    (attendee) => attendee.userId === userId
  ) as Attendees;

  // check if the token is valid
  if (event?.token !== token) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  // if user is already in the event, return a message with the event code
  if (isUserInEvent) {
    return NextResponse.json(
      {
        message: "User already in the event",
        code: isUserInEvent.code,
      },
      { status: 201 }
    );
  }

  try {
    // create a code for the user to join the event
    const code = randomUUID();

    // add the user to the event
    const updatedEvent = await db.update(Event).set({
      attendees: [...attendees, { userId: userId, code: code }],
    }).where(eq(Event._id, eventId));

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
