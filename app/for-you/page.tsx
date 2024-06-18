import Sidebar from "@/components/Sidebar";
import Widgets from "@/components/Widgets";
import Feed from "@/components/Feed";
import { backendUrl } from "@/app/utils/config/backendUrl";

export default async function ForYou() {
  const { trendingPosts, randomUsersResults } = await getWidgetsData();

  return (
    <div>
      <main
        role="main"
        className="flex  dark:bg-darkBg dark:text-darkText overflow-clip min-h-screen mx-auto"
      >
        {/* Sidebar */}
        <Sidebar />

        <div className="flex flex-grow w-full">
          {/* For-you Feed */}
          <Feed type={"for-you"} />

          {/* Widgets */}

          <Widgets
            trendingPosts={trendingPosts}
            randomUsersResults={randomUsersResults}
          />
        </div>
      </main>
    </div>
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
