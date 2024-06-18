import { db } from "@/db";
import { eq, not } from "drizzle-orm";
import { events as Event } from "@/models/Events";
import { NextResponse } from "next/server";
import { users as User } from "@/models/User";

// Private route
// Get all events
export async function GET(request: Request) {
  const userId = request.headers.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find the user based on the userId in the header
  const [user] = await db.select().from(User).where(eq(User._id, userId));

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 404 });
  }

  // Query all events where the user's ID matches the organizer field
  const eventsWhereUserIsOrganizer = await db.select().from(Event).where(eq(Event.organizer, user._id));
  // Query all events where the user is not the organizer
  const eventsWhereUserIsNotOrganizer = await db.select().from(Event).where(not(eq(Event.organizer, user._id)));
  // Combine the two arrays
  const allEvents = eventsWhereUserIsOrganizer.concat(eventsWhereUserIsNotOrganizer);

  // Format the response
  const events = allEvents.map((event) => {
    return {
      _id: event._id,
      title: event.title,
      description: event.description,
      image: event.image,
      date: event.date,
      location: event.location,
      verified: event.verified,
      coordinates: event.coordinates,
      organizer: event.organizer,
      link: event.link,
      ...(user._id?.toString() === event.organizer?.toString() && { attendees: event.attendees }),
      ...(user._id?.toString() === event.organizer?.toString() && { token: event.token }),
    };
  });

  return NextResponse.json({ events }, { status: 200 });
}
