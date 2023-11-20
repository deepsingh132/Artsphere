import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Widgets from "@/components/Widgets";
import CreateEventLayout from "@/components/createEventLayout";
import EventsLayout from "@/components/EventsLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Login from "../login/page";

export default async function Event({}) {

  const { trendingPosts, randomUsersResults } = await getWidgetsData();
  const session = await getServerSession(authOptions);
  const { events } = await getEvents(session);


  if (!session) {
    return (
      <Login />
    )
  }

  return (
    <main className="flex dark:bg-darkBg min-h-screen mx-auto">
      <Sidebar />
      <div className="flex ">
        <div className="mainContent max-w-2xl flex-col w-full xl:ml-[350px]  border-l border-r border-lightBorderColor dark:border-darkBorderColor sm:ml-[82px] flex-grow">
          <Navbar title="Events" />

          <div className="mainSection min-h-screen flex flex-col w-full mx-auto">
            <div className="eventInfo max-w-auto flex-col flex mx-8">
              <span className="text-black dark:text-darkText font-semibold py-8 md:text-xl text-xl lg:text-3xl">
                Events near you{" "}
              </span>
              <div className="flex mx-auto w-full  mt-4 justify-center content-end">
                <CreateEventLayout />
              </div>

              <div className="flex flex-wrap content-center justify-between md:mt-14">
                <EventsLayout events={events} />
              </div>
            </div>
          </div>
        </div>
        <Widgets
          trendingPosts={trendingPosts || []}
          randomUsersResults={randomUsersResults?.results || []}
        />
      </div>
    </main>
  );
}

async function getEvents(session: any) {

  if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
    return {
      events: [],
    };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/events`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.user?.accessToken}`,
      },
    }
  );
  const data = await res.json();

  return {
    events: data?.events || [],
  };
}

async function getWidgetsData() {

  if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
    return {
      trendingPosts: [],
      randomUsersResults: [],
    };
  }

  const trendingPosts = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/widgets/trending/posts`
  ).then((res) => res.json());

  // Who to follow section

  let randomUsersResults : any = [];

  try {
    const res = await fetch(
      "https://randomuser.me/api?results=10&inc=name,login,picture"
    );

    randomUsersResults = await res.json();
  } catch (e) {
    randomUsersResults = [];
  }

  return {
    trendingPosts: trendingPosts?.trendingPosts,
    randomUsersResults,
  };
}