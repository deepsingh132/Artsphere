'use client';

import { useSession } from "next-auth/react";
import Spinner from "./Spinner";
import EventCard from "./EventCard";

export default function EventsLayout({events}) {
  const { status, data: session } = useSession();

  if (status === "loading") {
    return (
      <div className="flex w-full self-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {events?.map((event) => (
        <EventCard key={event._id} event={event} user={session?.user} email={session?.user?.email} />
      ))}
    </>
  );

}