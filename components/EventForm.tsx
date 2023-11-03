import axios from "axios";
import { Modal } from "./modal";
import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toastError, toastSuccess } from "./Toast";

export default function EventForm({ closeModal }) {
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventStreamingLink, setEventStreamingLink] = useState("");
  const [file, setFile] = useState(null) as any; // for cloudinary
  const [eventImage, setEventImage] = useState("");
  const [lat, setLat] = useState(0) as any;
  const [lng, setLng] = useState(0) as any;
  const [loading, setLoading] = useState(false);
  const { status, data: session } = useSession();

  // stop scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const validateForm = () => {
    if (
      eventTitle.length === 0 ||
      eventDescription.length === 0 ||
      eventLocation.length === 0 ||
      eventDate.length === 0 ||
      eventTime.length === 0 ||
      lat === 0 ||
      lng === 0
    ) {
      alert("Please fill in all fields!");
      return false;
    }

    return true;
  };

  const uploadImage = async () => {
    try {
      setLoading(true);
      const formData = new FormData() as any;
      formData.append("file", file);
         formData.append(
           "upload_preset",
           process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
         );
            const res = await axios.post(
              `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
              formData
            );
      if (res.status === 200) {
        toastSuccess("Image uploaded successfully!", undefined);
        setEventImage(res.data.url);
        setLoading(false);
        return res.data.url;
      }
    } catch (error) {
      setLoading(false);
      toastError("Error uploading image", undefined);
      return null;
    }
  };

  const createEvent = async () => {
    try {
      if (file) {
        const res = await uploadImage();
        // return if image upload failed
        if (!res) {
          toastError("Something went wrong! , please try again later", undefined);
          return;
        }
    }
      const newEvent = {
        title: eventTitle,
        description: eventDescription,
        location: eventLocation,
        date: eventDate,
        time: eventTime,
        userId: session?.user?.id,
        image: eventImage || "",
        coordinates: {
          lat: lat,
          lng: lng,
        },
        streamingLink: eventStreamingLink || "",
      };
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${
          session?.user?.email?.split("@")[0]
        }`,
        newEvent,
        // set auth header
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );
      if (res.status === 200) {
        toastSuccess("Event created successfully!", undefined);
        setLoading(false);
        closeModal();
      }
    } catch (error) {
      setLoading(false);
      toastError("Error creating event", undefined);
    }
  };

  return (
    <Modal closeModal={closeModal}>
      <div className="flex min-w-[70vw] p-4 md:min-w-[0px] h-full flex-col md:justify-center md:items-center">
        <div className="title flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold text-gray-700 dark:text-darkText">
            Create an event
          </h1>
          <h2 className="text-lg text-gray-500 mt-2 pb-5">
            Fill in the details below to create an event
          </h2>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (validateForm()) {
              createEvent();
            }
          }}
        >
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              name="floating_title"
              id="floating_title"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
            <label
              htmlFor="floating_title"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Event Title
            </label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              name="floating_description"
              id="floating_description"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            />
            <label
              htmlFor="floating_description"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Event Description
            </label>
          </div>
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              name="floating_location"
              id="floating_location"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
            />
            <label
              htmlFor="floating_repeat_password"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Event Location
            </label>
          </div>
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="date"
                name="floating_date"
                id="floating_date"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
              <label
                htmlFor="floating_date"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Event Date
              </label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="time"
                name="floating_time"
                id="floating_time"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
              />
              <label
                htmlFor="floating_time"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Event Time
              </label>
            </div>
          </div>
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="number"
                // set the min and max values for the lat and lng
                min="-90"
                max="90"
                step="0.001"
                name="floating_lat"
                id="floating_lat"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
              <label
                htmlFor="floating_lat"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Event Latitude
              </label>
            </div>
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="number"
                // set the min and max values for lng
                min="-180"
                max="180"
                step="0.001"
                name="floating_lng"
                id="floating_lng"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={lng}
                onChange={(e) => setLng(e.target.value)}
              />
              <label
                htmlFor="floating_lng"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Event Longitude
              </label>
            </div>
          </div>
          {/*
          event streaming link
          */}
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              name="floating_streaming_link"
              id="floating_streaming_link"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              value={eventStreamingLink}
              onChange={(e) => setEventStreamingLink(e.target.value)}
            />
            <label
              htmlFor="floating_streaming_link"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Event Streaming Link (Optional)
            </label>
          </div>
          <div className="eventImage w-full mb-6 group">
            <label
              htmlFor="eventImage"
              className="block text-sm text-gray-500 dark:text-gray-400"
            >
              Event Image (Optional)
            </label>
            <input
              type="file"
              name="eventImage"
              id="eventImage"
              onChange={(e) => setFile(e?.target?.files?.[0])}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
          </div>
          <div className="flex w-full items-center justify-center">
            <button
              type="submit"
              disabled={loading}
              className="text-white bg-primary hover:brightness-90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {loading &&
                (
                  <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                  </svg>
                )}


              {loading ? "Creating..." : "Create"}

            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
