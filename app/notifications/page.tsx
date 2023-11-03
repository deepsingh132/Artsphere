import CommentModal from "@/components/CommentModal";
import Sidebar from "@/components/Sidebar";
import Widgets from "@/components/Widgets";
import NotificationsLayout from "@/components/Notifications";
import Navbar from "@/components/Navbar";

export default async function Notifications({}) {
  const { trendingPosts, randomUsersResults } = await getWidgetsData();

  return (
    <main>
      <div className="flex dark:bg-darkBg dark:text-darkText min-h-screen mx-auto overflow-clip">
        <Sidebar />
        <div className="flex flex-grow w-full">
          <div className="xl:ml-[350px] border-l border-r border-lightBorderColor dark:border-darkBorderColor  xl:min-w-[680px] sm:ml-[82px] justify-center sm:w-full content-center items-center flex-grow max-w-2xl">
            <Navbar title={"Notifications"} />
            <NotificationsLayout />
          </div>
          <Widgets
            trendingPosts={trendingPosts || []}
            randomUsersResults={randomUsersResults?.results || []}
          />
        </div>
      </div>
    </main>
  );
}

async function getWidgetsData() {
  const trendingPosts = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/widgets/trending/posts`
  ).then((res) => res.json());

  // Who to follow section

  let randomUsersResults : any = [];

  try {
    const res = await fetch(
      "https://randomuser.me/api/?results=10&inc=name,login,picture"
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
