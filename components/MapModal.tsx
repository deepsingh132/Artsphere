import { ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Moment from "react-moment";
import GoogleMapsLoader from "./Map";
import { useMemo, useState } from "react";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { toastError, toastSuccess } from "./Toast";
import { backendUrl } from "@/app/utils/config/backendUrl";

export default function MapModal({ event, closeModal, user}) {
  const [liveBtnClicked, setLiveBtnClicked] = useState(false);
  const [secureToken, setSecureToken] = useState("");
  const [revealToken, setRevealToken] = useState(false);
  // memoize googlemapsloader
  const GoogleMapsLoaderMemo = useMemo(
    () => (
      <GoogleMapsLoader
        currentEvent={event?.coordinates}
        accessToken={user?.accessToken}
      />
    ),
    [event?.coordinates, user]
  );

  function handleLiveBtnClick() {
    liveBtnClicked ? setLiveBtnClicked(false) : setLiveBtnClicked(true);
  }

  async function handleTokenSubmit() {
    if (!secureToken.trim()) return;
    try {
      const res = await axios.post(
        `${backendUrl}/events/live`,
        {
          userId: user?.id,
          eventId: event?._id,
          token: secureToken.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );

      if (res.status == 200) {
        toastSuccess(
          "You have successfully joined the event, your live code is: " +
          res?.data?.code,
          {
            duration: 10000,
          }
        );
        setLiveBtnClicked(false);
      }

      if (res.status == 201) {
        toastSuccess(
          res?.data?.message + ", code: " + res?.data?.code,
          {
            duration: 10000,
          }
        );
        setLiveBtnClicked(false);
      }
    } catch (error) {
      toastError(error?.response?.data?.message, undefined);
      setLiveBtnClicked(false);
    }
  }

  // block scroll when modal is open
  if (typeof window !== "undefined") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
  }

  return (
    <div
      className="fixed cursor-auto inset-0 z-[999] shadow backdrop-blur-sm  p-0 bg-black bg-opacity-40 flex justify-center items-center transition-opacity duration-300"
      onClick={closeModal}
    >
      <div className="closeBtn z-[1000] font-black fixed rounded-full shadow-xl bg-white hover:bg-gray-200 sm:right-[20px] right-[0px] top-[20px] flex p-2 transition duration-500 ease-in-out">
        <XMarkIcon
          className=" text-gray-700 font-black h-6 cursor-pointer"
          onClick={closeModal}
        />
      </div>
      <div
        className="modal relative rounded-2xl overflow-hidden border border-lightBorderColor dark:border-darkBorderColor bg-white  sm:w-[calc(100%-80px)] w-[calc(100%-20px)] h-[calc(100%-80px)] opacity-100 transition-opacity duration-300 transform scale-100"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="modalContainer flex flex-row items-center w-full h-full">
          <div className="modalLeft md:px-4 dark:bg-darkCard overflow-y-scroll dark:border-gray-700 border border-r py-6 mx-auto border-gray-300 fixed hidden md:flex flex-col p-2 justify-start items-start w-[40%] lg:w-[25%] h-full">
            <Image
              src={event?.image}
              width={200}
              height={200}
              objectFit="cover"
              loader={({ src }) => src}
              className="md:h-[200px] h-[150px] w-full rounded-lg "
              alt="event image"
            />
            <h1 className="text-xl dark:text-white font-bold">
              {event?.title}
            </h1>
            <p className="text-sm text-gray-700 dark:text-gray-400 font-semibold">
              {event?.location}
            </p>
            <Moment fromNow className="text-gray-700 dark:text-gray-400">
              {event?.date}
            </Moment>
            <p className="text-sm text-gray-700 dark:text-gray-400 font-semibold">
              {event?.time}
            </p>
            {event?.token && (
              <div className="secureLayout transition-all delay-200 duration-500 md:text-base flex flex-row justify-start whitespace-pre-wrap items-center w-full">
                <h1 className=" text-gray-700 whitespace-nowrap dark:text-gray-400 font-normal">
                  Secure Token:
                </h1>
                <p className="ml-2 text-gray-700  dark:text-gray-400 font-normal">
                  {revealToken ? event?.token : "********"}
                </p>
                <div className="flex justify-end w-full">
                  {revealToken ? (
                    <EyeSlashIcon
                      className="h-5 ml-2 cursor-pointer"
                      onClick={() => setRevealToken(false)}
                    />
                  ) : (
                    <EyeIcon
                      className="h-5 ml-2 cursor-pointer"
                      onClick={() => setRevealToken(true)}
                    />
                  )}
                </div>
              </div>
            )}

            <div className="joinBtnContainer font-roboto md:pb-14 top-0 relative flex lg:flex-row justify-end items-center mt-4 mx-auto w-full">
              <button
                onClick={handleLiveBtnClick}
                className="joinBtn text-text shadow-xl  hover:brightness-90 md:min-w-[100px] md:min-h-[40px] p-2 bg-primary text-sm font-bold rounded-full transition duration-500 ease-in-out "
              >
                Go Live
              </button>
              <button
                className="joinBtn text-text shadow-xl hover:brightness-90 md:ml-4 md:min-w-[100px] md:min-h-[40px] p-2 bg-secondary text-sm font-bold rounded-full transition duration-500 ease-in-out "
                onClick={() => {
                  if (event?.link) window.open(event?.link, "_blank");
                  else {
                    alert("Stream link not found for this event!");
                  }
                }}
              >
                Join
              </button>
              {liveBtnClicked && (
                <div className="goLiveContainer absolute flex flex-col justify-end md:top-14 items-end w-full h-full">
                  <input
                    type="text"
                    placeholder="Enter LiveCode"
                    value={secureToken}
                    onChange={(e) => setSecureToken(e.target.value)}
                    className="text-black shadow-sm hover:shadow-md focus:ring-0 focus:border-gray-900 focus-within:shadow-lg md:min-w-[60px] p-2 bg-gray-100 focus-within:bg-white  text-sm font-bold rounded-full"
                  />
                  <div className="flex group relative justify-end top-2 items-start w-full h-full">
                    <button
                      onClick={handleTokenSubmit}
                      className="flex text-white justify-center content-center items-center align-middle absolute shadow-xl md:min-w-[60px] md:min-h-[40px] p-2 bg-text text-sm font-bold rounded-full transition duration-500 ease-in-out"
                    >
                      <span className="pl-2">Get Token</span>
                      <ChevronRightIcon className="h-4 ml-1 mr-2 group-hover:animate-chevronMove" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="eventInfoContainer dark:text-darkText md:mt-12 mt-4 flex flex-col h-full flex-grow justify-start items-center w-full">
              <Image
                src={event?.image}
                width={1080}
                height={1920}
                objectFit="cover"
                loader={({ src }) => src}
                className="w-auto max-w-xs object-cover overflow-hidden h-auto max-h-full md:hidden rounded "
                alt="event image"
              />
              <h1 className="md:hidden text-xl font-bold">{event?.title}</h1>
              <p className="text-base mt-4 font-normal">{event?.description}</p>
              <p className="text-lg font-semibold">{event?.host}</p>
              <p className="text-ls font-semibold">
                Attendees:{" "}
                {event?.attendees
                  ?.map((attendee: { userId: any; }) => attendee?.userId)
                  .join(", ") || "None"}
              </p>
              <p className="text-xl font-semibold">{event?.likes}</p>
              <p className="text-xl font-semibold">{event?.tags}</p>
            </div>
          </div>
          <div className="modalRight flex flex-col justify-start items-center md:ml-[40%] lg:ml-[25%] w-full h-full">
            <div className="mapContainer flex sticky justify-center content-center align-middle w-full">
              {GoogleMapsLoaderMemo}
            </div>
            <div className="mobileEventInfoContainer p-4 dark:bg-darkCard h-full dark:text-darkText overflow-hidden overflow-y-auto md:mt-12 md:hidden flex flex-col justify-start items-center w-full">
              <Image
                src={event?.image}
                width={1000}
                height={1000}
                unoptimized={true}
                loader={({ src }) => src}
                className="w-[300px] max-w-xs object-cover mt-4  md:hidden rounded-lg "
                alt="event image"
              />
              <h1 className="md:hidden text-xl mt-4 font-bold">{event?.title}</h1>
              <p className="md:hidden text-base mt-4 font-normal">
                {event?.description}
              </p>
              <p className="md:hidden text-lg font-semibold">{event?.host}</p>
              <p className="md:hidden text-ls font-semibold">
                {
                  event?.attendees?.length > 0 ?
                    "Attendees: " +
                    event?.attendees.map((attendee: { userId: any; }) => attendee?.userId).join(", ")
                    :"No Attendees"
                  }
              </p>
              <p className="md:hidden text-xl font-semibold">{event?.likes}</p>
              <p className="md:hidden text-xl font-semibold">{event?.tags}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
