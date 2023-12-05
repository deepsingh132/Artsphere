import Sidebar from "@/components/Sidebar";
import Widgets from "@/components/Widgets";
import Navbar from "@/components/Navbar";
import PostModal from "@/components/PostModal";
import Image from "next/image";
import moment from "moment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { BellIcon } from "@heroicons/react/24/outline";
import { backendUrl } from "../utils/config/backendUrl";

export default async function Notifications({}) {
  const { trendingPosts, randomUsersResults } = await getWidgetsData();
  const session = await getServerSession(authOptions);

  // create dummy notifications
  const notifications = [
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

  return (
    <main>
      <div className="flex dark:bg-darkBg dark:text-darkText min-h-screen mx-auto overflow-clip">
        <Sidebar />
        <div className="flex flex-grow w-full">
          <div className="xl:ml-[350px] border-l border-r border-lightBorderColor dark:border-darkBorderColor  xl:min-w-[680px] sm:ml-[82px] justify-center sm:w-full content-center items-center flex-grow max-w-2xl">
            <Navbar title={"Notifications"} />

            {session && notifications.length > 0 ? (
              <div>
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
                        <span className="font-semibold">
                          {notification.name}
                        </span>{" "}
                        {notification.message}
                      </p>
                      <span className="text-gray-500 text-base font-bold">
                        ·
                      </span>
                      <span className="text-gray-500 text-base">
                        {moment(notification.timestamp).fromNow()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center w-full h-full">
                <BellIcon className="h-20 w-20 text-gray-400" />
                <p className="text-lg font-semibold">
                  You have no notifications
                </p>
              </div>
            )}
          </div>
          <Widgets
            trendingPosts={trendingPosts}
            randomUsersResults={randomUsersResults}
          />
        </div>
      </div>
      <PostModal updatePosts={undefined} type={"post"} />
    </main>
  );

  async function getWidgetsData() {

    if (!backendUrl || backendUrl === "undefined") {
      return {
        trendingPosts: [],
        randomUsersResults: [],
      };
    }

    try {
      const trendingPostsRes = await fetch(
        `${backendUrl}/widgets/trending/posts`
      );
      const randomUsersRes = await fetch(
        "https://randomuser.me/api/?results=10&inc=name,login,picture"
      );

      const trendingPosts = await trendingPostsRes.json();
      const randomUsersResults = await randomUsersRes.json();

      return {
        trendingPosts: trendingPosts.trendingPosts,
        randomUsersResults: randomUsersResults.results,
      };
    } catch (error) {
      return {
        trendingPosts: [],
        randomUsersResults: [],
      };
    }
  }
}