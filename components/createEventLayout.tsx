"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import EventForm from "./EventForm";
import { toastError, toastSuccess } from "./Toast";

export default function CreateEventBtn() {
  const { status, data: session } = useSession();
  const [username, setUsername] = useState<string>("");
  const [isVerified, setIsVerified] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [eventModalOpen, setEventModalOpen] = useState(false);

  function closeModal() {
    setEventModalOpen(false);
  }

  useEffect(() => {
    if (session) {
      setUsername(session?.user?.email.split("@")[0] || "");
    }
  }, [session]);

  useEffect(() => {
    const checkVerified = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${username}`
        );
        if (res.status === 200) {
          if (res.data.user.verified) {
            setIsVerified(true);
            setLoading(false);
          }
          if (res.data.user.role === "organizer") {
            setIsOrganizer(true);
            setLoading(false);
          }
        }
      } catch (error) {
        setIsVerified(false);
        setLoading(false);
        toastError("Error checking role", undefined);
      }
    };
    if (session && username.length > 0) {
      checkVerified();
    }
  }, [session, username]);

  const createOrganizer = async () => {
    if (isOrganizer) {
      alert(
        "You have already signed up for the organizer role, please wait for verification!"
      );
      return;
    }

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${username}`,
        {
          organizer: true,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );
      if (res.status === 200) {
        toastSuccess("You have signed up for the organizer role!", undefined);
      }
    } catch (error) {
      toastError("Error signing up for organizer role", undefined);
    }
  };

  if (status === "loading" || loading) {
    return <></>;
  }

  return (
    <div className="flex w-full mx-2 justify-end content-end">
      {!isOrganizer && (
        <button
          type="button"
          role="btn"
          onClick={() => createOrganizer()}
          className="flex self-end text-text bg-transparent w-1/4 max-w-[250px] rounded-3xl h-[40px] p-[10px] hover:bg-[#E6E6E6] hover:shadow-md transition-all duration-300 ease-in-out min-w-fit outline-none items-center justify-center border border-gray-700 whitespace-nowrap"
        >
          <span className="flex items-center justify-between text-text font-bold">
            Sign up as an organizer
          </span>
        </button>
      )}
      {isVerified && isOrganizer && (
        <button
          className="bg-primary hover:brightness-90 mx-2 text-text h-fit w-fit font-bold p-2 rounded-full"
          onClick={() => setEventModalOpen(true)}
        >
          Create Event
        </button>
      )}
      {eventModalOpen && isVerified && <EventForm closeModal={closeModal} />}
    </div>
  );
}
