import Sidebar from "@/components/Sidebar";
import Widgets from "@/components/Widgets";
import SinglePost from "@/components/SinglePost";
import Navbar from "@/components/Navbar";
import { backendUrl } from "@/app/utils/config/backendUrl";

export default async function PostPage({ params }) {
  const { id } = params;

  const { trendingPosts, randomUsersResults } = await getWidgetsData();

  return (
    <div>
      <main className="flex dark:bg-darkBg min-h-screen mx-auto overflow-clip">
        {/* Sidebar */}
        <Sidebar />

        {/* Feed */}

        {/* <div className="flex w-full"> */}
          <div className="mainContent flex flex-col xl:ml-[350px] border-l border-r border-lightBorderColor dark:border-darkBorderColor w-screen sm:max-w-[calc(100vw-82px)] md:max-w-2xl xl:min-w-[680px] sm:ml-[82px] lg:max-w-[650px] flex-grow ">
            <Navbar title={"Post"} />
            <SinglePost id={id} />
          </div>

          {/* Widgets */}

          <Widgets
            trendingPosts={trendingPosts || []}
            randomUsersResults={randomUsersResults?.results || []}
          />

      </main>
    </div>
  );
}

async function getWidgetsData() {

  if (!backendUrl || backendUrl === "undefined") {
    return {
      trendingPosts: [],
      randomUsersResults: [],
    };
  }

  const trendingPosts = await fetch(
    `${backendUrl}/widgets/trending/posts`
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