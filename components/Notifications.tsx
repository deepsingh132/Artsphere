"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { useRecoilState } from "recoil";
import { ArrowLeftIcon, BellIcon } from "@heroicons/react/24/outline";
import Navbar from "./Navbar";
import Image from "next/image";
import Spinner from "./Spinner";

export default function NotificationsLayout({}) {
  const { status, data: session } = useSession();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(null) as any;

  // create dummy notifications
  const dummyData = [
    {
      _id: "1",
      userImg:
        "https://images.pexels.com/photos/17745308/pexels-photo-17745308/free-photo-of-city-street-building-wall.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      name: "John Doe",
      message: "Tesla stock price is going up",
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    {
      _id: "2",
      userImg:
        "https://images.pexels.com/photos/18147099/pexels-photo-18147099/free-photo-of-fantastische-reflektion-im-herbst.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      name: "Bela Lugosi",
      message: "liked your post",
      timestamp: "2023-09-01T16:00:00.000Z",
    },
    {
      _id: "3",
      userImg:
        "https://images.pexels.com/photos/12132145/pexels-photo-12132145.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      name: "Ramprakash Chatriwala",
      message: "challenged you to an art battle",
      timestamp: "2023-09-01T16:00:00.000Z",
    },
    {
      _id: "4",
      userImg:
        "https://images.pexels.com/photos/18263099/pexels-photo-18263099/free-photo-of-a-car-in-the-forest-under-a-starry-sky.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      name: "Sonty Poplu",
      message: "Faceoff is starting in 5 minutes",
      timestamp: "2023-09-01T16:00:00.000Z",
    },
    {
      _id: "5",
      userImg:
        "https://images.pexels.com/photos/15036478/pexels-photo-15036478/free-photo-of-forest-in-autumn.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      name: "Emily hill",
      message: "challenged you to an art battle",
      timestamp: Date.now(),
    },
  ];

  const [notifications, setNotifications] = useState(dummyData);

  useEffect(() => {
    if (session) {
      setCurrentUser(session?.user);
    } else {
      setCurrentUser(null);
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="flex justify-center self-center m-12 flex-grow items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {status === "unauthenticated" && notifications?.length === 0 ? (
        <div className="flex h-[calc(100%-3.5rem)] items-center justify-center flex-col mt-10">
          <BellIcon className="h-10 w-10 text-gray-500" />
          <h1 className="text-lg font-semibold text-gray-500 mt-5">
            No notifications
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            You will see notifications about your account here
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="topBar sticky flex flex-col justify-start items-start w-full h-max">
            <div className="tabBarLayout py-1 sticky flex flex-row justify-between items-center w-full h-max border-lightBorderColor dark:border-darkBorderColor">
              <div className="tabBar flex flex-row justify-evenly mx-auto items-center w-full h-full">
                <div className="tabBarItem bg-primary text-white rounded-full p-3 hover:brightness-90  cursor-pointer">
                  <h1 className="text-lg font-bold">Notifications</h1>
                </div>
                <div className="tabBarItem rounded-full p-3 hoverEffect  cursor-pointer">
                  <h1 className="text-lg font-bold">Challenges</h1>
                </div>
              </div>
            </div>
          </div>

          {notifications?.map((notification) => (
            <div
              key={notification?._id}
              className="flex items-center sm:p-4 space-x-2 text-sm mt-2 rounded-md hover:bg-gray-200 dark:hover:bg-darkHover cursor-pointer"
            >
              <Image
                src={notification.userImg}
                alt=""
                className="rounded-full h-11 w-11 object-cover"
                width={40}
                height={40}
              />
              <p className="flex-1">
                <span className="font-semibold">{notification.name}</span>{" "}
                {notification.message}
              </p>
              <span className="text-gray-500 text-base font-bold">·</span>
              <Moment className="pr-5 text-gray-500" fromNow>
                {notification.timestamp}
              </Moment>
            </div>
          ))}
        </div>
      )}
    </div>
  );

}
