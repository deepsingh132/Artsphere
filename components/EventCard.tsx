'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Moment from "react-moment";
import MapModal from "./MapModal";

export default function EventCard({ event, user, email }) {

  const [modalOpen, setModalOpen] = useState(false);

  function handleEventClick() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  useEffect(() => {
    // Set the body overflow to hidden when the modal is open
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modalOpen]);


  return (
    <div className="eventCard cursor-pointer mx-auto my-4 md:w-[300px] w-[250px] flex flex-col justify-center items-center rounded-2xl shadow-md hover:shadow-lg">
      <div className="eventCardImage w-full h-full relative">
        <Image
          referrerPolicy="no-referrer"
          src={event?.image}
          width={200}
          height={150}
          loader={({ src }) => src}
          unoptimized={true}
          className="md:h-[200px] h-[150px]  w-full rounded-2xl "
          alt="event image"
        />
        <div className="eventCardOverlay absolute top-0 flex flex-col justify-center items-center w-full h-full rounded-2xl bg-black bg-opacity-20 ">
          <div className="eventCardOverlayDate absolute my-2 top-0 self-end mx-2 align-top flex flex-col justify-start items-start">
            <div className="dateCircle text-white mx-1 align-top flex flex-col justify-center items-center md:min-w-[45px] md:min-h-[45px] px-3 rounded-full bg-gray-500 bg-opacity-50 backdrop-blur-sm">
              <p className="text-base font-bold">
                <Moment format="DD">{event?.date}</Moment>
              </p>
              <p className="text-sm font-semibold">
                <Moment format="MMM">{event?.date}</Moment>
              </p>
            </div>
          </div>
          <div className="eventCardOverlayInfo absolute bottom-0 w-full rounded-b-2xl self-start align-bottom flex flex-col justify-end items-start bg-gray-400 bg-opacity-30 backdrop-blur-sm">
            <div className="flex infoContainer">
              <div className="flex flex-col info px-2 mx-2 my-2">
                <p className="text-white text-base font-bold">{event?.title}</p>
                <p className="text-white text-sm font-bold">
                  {event?.location} - <Moment fromNow>{event?.date}</Moment>
                </p>
              </div>
              <div className="flex absolute actionBtn px-2 w-full justify-end align-middle content-center self-center">
                <button
                  name="joinBtn"
                  role="button"
                  onClick={handleEventClick}
                  className="text-black shadow-xl hover:shadow-black md:min-w-[60px] p-2 bg-white text-sm font-bold rounded-full transition duration-500 ease-in-out "
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {modalOpen && (
        <MapModal event={event} closeModal={closeModal} user={user} />
      )}
    </div>
  );
}
