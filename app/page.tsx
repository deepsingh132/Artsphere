import Sidebar from "@/components/Sidebar";
import Widgets from "@/components/Widgets";
import RefreshFeed from "@/components/RefreshFeed";
import CommentModal from "@/components/CommentModal";

export default async function Home() {
  const { trendingPosts, randomUsersResults } = await getWidgetsData();

  return (
    <div>
      <main className="flex  dark:bg-darkBg dark:text-darkText overflow-clip min-h-screen mx-auto">

        {/* Sidebar */}
        <Sidebar />

        <div className="flex flex-grow w-full">
          {/* Feed */}
          <RefreshFeed />

          {/* Widgets */}

          <Widgets
            trendingPosts={trendingPosts || []}
            randomUsersResults={randomUsersResults?.results || []}
          />
        </div>
      </main>
    </div>
  );
}

async function getWidgetsData() {

  if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
    return {
      trendingPosts: [],
      randomUsersResults: [],
    };
  }

  // Trending posts section
  // TODO: add backend route for trending posts
  const trendingPosts =
    await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/widgets/trending/posts`
  ).then((res) => res.json());

  // Who to follow section

  let randomUsersResults: any = [];

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
