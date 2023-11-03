import { connectMongoDB } from "@/libs/mongodb";
import Events from "@/models/Events";
import { NextResponse } from "next/server";
import User from "@/models/User";

// Private route
// Get all events
export async function GET(request: Request) {
  await connectMongoDB();
  const email = request.url.split("=")[1];

  // Find the user based on the provided email
  const user = await User.findOne({ email: email });

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 404 });
  }

  // Query all events where the user's ID matches the organizer field
  const eventsWhereUserIsOrganizer = await Events.find({ organizer: user._id });
  // Query all events where the user is not the organizer
  const eventsWhereUserIsNotOrganizer = await Events.find({ organizer: { $ne: user._id } });
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
