import Sidebar from "@/components/Sidebar";
import Widgets from "@/components/Widgets";
import UserProfileData from "@/components/UserProfileData";
import CommentModal from "@/components/CommentModal";
import PostModal from "@/components/PostModal";
import { backendUrl } from "../utils/config/backendUrl";

export default async function UserProfile({}) {
  const { trendingPosts, randomUsersResults } = await getWidgetsData();

  return (
    <main className="flex dark:bg-darkBg min-h-screen mx-auto">
      {/* Sidebar */}
      <Sidebar />
      <div className="flex justify-evenly">
        <div className="mainContent flex flex-col xl:ml-[350px] border-l border-r border-lightBorderColor dark:border-darkBorderColor w-screen sm:max-w-[calc(100vw-82px)] md:max-w-2xl xl:min-w-[680px] sm:ml-[82px] lg:max-w-[650px] flex-grow">
          {/* <Navbar /> */}
          <div className="mainSection min-h-screen flex flex-col w-full lg:max-w-[650px] xl:max-w-3xl mx-auto">
            <UserProfileData />
          </div>
        </div>
      </div>
      <Widgets
        trendingPosts={trendingPosts || []}
        randomUsersResults={randomUsersResults?.results || []}
      />
      <PostModal updatePosts={undefined} type={"post"} />
      <CommentModal updatePosts={undefined} type={undefined} />
    </main>
  );
}



async function getWidgetsData() {

  if (!backendUrl) {
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
