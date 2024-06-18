import Sidebar from "@/components/Sidebar";
import Widgets from "@/components/Widgets";
import Navbar from "@/components/Navbar";
import { backendUrl } from "../utils/config/backendUrl";
import SearchUser from "@/components/searchUser";
import Post from "@/components/Post";
import CommentModal from "@/components/CommentModal";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import PostModal from "@/components/PostModal";

type SearchResults = {
  userResults:
    | [
        {
          _id: string;
          image: string;
          followers: string[];
          username: string;
          name: string;
        }
      ]
    | null;
  postResults:
    | [
        {
          _id: string;
          userImg: string;
          username: string;
          name: string;
          content: string;
          likes: string[];
          comments: [] | null;
          authorID: string;
          url: string | "";
          createdAt: string;
          updatedAt: string;
        }
      ]
    | null;
};

export default async function Search({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  const currentUser = session?.user;

  if (
    currentUser?.accessToken === null ||
    currentUser?.accessToken === undefined
  ) {
    redirect("/login");
  }

  const { q } = searchParams;

  const { trendingPosts, randomUsersResults } = await getWidgetsData();
  const searchResults = (await getSearchResults(
    q as string,
    currentUser?.accessToken
  )) as SearchResults;

  const users = searchResults?.userResults || [];
  const posts = searchResults?.postResults || [];

  return (
    <div className="flex dark:bg-darkBg min-h-screen mx-auto overflow-clip">
      <Sidebar />
      <div className="mainContent flex flex-col xl:ml-[350px] border-l border-r border-lightBorderColor dark:border-darkBorderColor w-screen sm:max-w-[calc(100vw-82px)] md:max-w-2xl xl:min-w-[680px] sm:ml-[82px] lg:max-w-[650px] flex-grow">
        <Navbar title={"Search"} />
        {users.length > 0 && (
          <div className="py-3 px-4">
            <h2 className="text-xl font-extrabold">Artists</h2>
          </div>
        )}
        <div className="flex flex-col">
          <div className=" pb-2">
            {users.length > 0 &&
              users.map((user) => (
                <>
                  <SearchUser key={user._id} currentUser={session} user={user} />
                </>
              ))}
          </div>
          {users.length > 0 && (
            <div className="border-b border-lightBorderColor dark:border-darkBorderColor"></div>
          )}
          {posts?.length > 0 && (
            <>
              {/* <div className="py-3 px-4">
                <h2 className="text-xl font-extrabold">Posts</h2>
              </div> */}
              <div className="flex flex-col">
                {posts.map((post) => (
                  <div key={post._id} className="flex flex-col">
                    <Post
                      key={post._id}
                      id={post._id}
                      post={post}
                      updatePosts={undefined}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {users.length === 0 && posts.length === 0 && (
            <div className="flex justify-center items-center h-[50vh]">
              <h2 className="text-2xl font-bold text-gray-500">
                No results found for &quot;{q}&quot;
              </h2>
            </div>
          )}
        </div>
      </div>
      <Widgets
        trendingPosts={trendingPosts || []}
        randomUsersResults={randomUsersResults?.results || []}
      />
      <PostModal type={"post"} updatePosts={undefined} />
      <CommentModal type={undefined} updatePosts={undefined} />
    </div>
  );
}

async function getSearchResults(query: string, accessToken: string) {
  if (!backendUrl || backendUrl === "undefined" || !accessToken) {
    return [];
  }

  const searchResults = await fetch(`${backendUrl}/search/full?q=${query}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-cache",
  }).then((res) => res.json());

  return searchResults;
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
