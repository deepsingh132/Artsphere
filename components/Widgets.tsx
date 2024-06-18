'use client'

import { MagnifyingGlassIcon as SearchIcon } from "@heroicons/react/24/outline";
import Trending from "./Trending";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Spinner from "./Spinner";
import { toastError } from "./Toast";
import "./WidgetSearchBox.css";
import { AutoComplete } from "primereact/autocomplete";
import { useRouter } from "next/navigation";

export default function Widgets({ trendingPosts, randomUsersResults } : {trendingPosts: Post[], randomUsersResults: any}) {
  const [postNum, setPostNum] = useState(3);
  const [randomUserNum, setRandomUserNum] = useState(3);
  const { status } = useSession();
  const [searchInput, setSearchInput] = useState("");
  const [fetching, setFetching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const router = useRouter();

  type SearchResult = {
    _id: string,
    userImg: string,
    username: string,
    name: string,
  };

  useEffect(() => {
    const searchUsers = async () => {
      try {
        setFetching(true);
        const res = await fetch(`/api/search?search=${searchInput}`);
        const data = await res.json() as { results: SearchResult[], error: string };
        if (data.error) {
          setFetching(false);
          toastError(data.error, undefined);
        }
        setFetching(false);
        setSearchResults(data.results);
      } catch (error) {
        setFetching(false);
        toastError("Error searching", undefined);
      }
    };
    if (searchInput?.trim() !== "") {
      searchUsers();
    }
  }, [searchInput]);

  // check if trending posts or random users are empty issue a toast
  if (status !== "loading" && trendingPosts?.length === 0) {
    toastError("Error loading widgets", undefined);
  }

  const handleSelect = (e: any) => {
    setSearchInput("");
    if(e.originalEvent.target.innerText.includes("Search for") && searchInput.trim() !== "") {
      router.push(`/search?q=${searchInput}`);
    }
    else {
      router.push(`/${e.value.username}`);
    }
    // router.push(`/${e}`);
  };

  const itemTemplate = (item: SearchResult, index: number) => {

    return (
      <>
        {index === 0 ? (
          <>
            <div className="progressBar z-10 h-[0.2rem] flex w-full  overflow-hidden">
              <div
                className={`${fetching ? "w-[0%] " : "w-[30%]"}
                progressBar__fill h-full !ease-linear transition-width !duration-500 bg-primary`}
              ></div>
            </div>
            <div className="flex items-center px-4 py-4  cursor-pointer hover:bg-gray-200 dark:hover:bg-darkHover transition duration-500 ease-out">
              <p>
                <span className="font-bold dark:text-darkText">Search for</span>{" "}
                &quot;
                {searchInput}
                &quot;
              </p>
            </div>
            <div className=" flex w-full h-[1px] my-1 bg-gray-200 dark:bg-[rgb(47,51,54)]"></div>
            <div className="flex items-center px-4 py-3  cursor-pointer hover:bg-gray-200 dark:hover:bg-darkHover transition duration-500 ease-out">
              <Image
                className="rounded-full h-[40px] w-[40px]"
                width={40}
                height={40}
                referrerPolicy="no-referrer"
                unoptimized={true}
                loader={({ src }) => src}
                src={item.userImg}
                alt="img"
              />
              <div className="truncate ml-2 leading-5">
                <h4 className="font-bold hover:underline dark:text-darkText text-[14px] truncate">
                  {item.username}
                </h4>
                <h5 className="text-[13px] text-gray-500  truncate">
                  {item.name}
                </h5>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center px-4 py-3  cursor-pointer hover:bg-gray-200 dark:hover:bg-darkHover transition duration-500 ease-out">
            <Image
              referrerPolicy="no-referrer"
              className="rounded-full h-[40px] w-[40px]"
              width={40}
              height={40}
              unoptimized={true}
              loader={({ src }) => src}
              src={item.userImg}
              alt="img"
            />
            <div className="truncate ml-2 leading-5">
              <h4 className="font-bold hover:underline dark:text-darkText text-[14px] truncate">
                {item.username}
              </h4>
              <h5 className="text-[13px] text-gray-500  truncate">
                {item.name}
              </h5>
            </div>
          </div>
        )}
      </>
    );
  }


  return (
    <div
      role="widgets"
      data-testid="widgets"
      className={`hidden lg:inline ml-[30px] pb-4 ${
        status == "loading" ? "" : ""
      }  mr-[30px] space-y-5 min-w-[200px] max-w-[350px] xl:w-[350px]`}
    >
      <div className="searchBox min-w-[200px] xl:w-[100%] sticky top-0 bg-white dark:bg-darkBg py-2 z-30">
        <div className="flex items-center p-3 w-full  rounded-full relative !outline-none">
          <SearchIcon className="h-5 z-50 text-gray-500" />
          <AutoComplete
            delay={300}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            suggestions={
              searchResults && searchResults?.length > 0
                ? searchResults?.map((result) => ({
                    _id: result._id,
                    userImg: result.userImg,
                    username: result.username,
                    name: result.name,
                  }))
                : []
            }
            field="username"
            placeholder="Search art/ists"
            itemTemplate={itemTemplate}
            completeMethod={() => {}}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchInput.trim() !== "") {
                router.push(`/search?q=${searchInput}`);
              }
            }}

            onSelect={(e) => handleSelect(e)}
            className="w-[100%] focus:ring-0 focus:border-red-400 !inset-0 rounded-full pl-11 border-gray-500 text-gray-700 dark:text-darkText focus:shadow-lg focus:bg-white bg-gray-100 dark:bg-darkCard"
          />
        </div>
      </div>

      <div className="text-gray-700 space-y-3 bg-gray-100 dark:bg-darkCard rounded-xl pt-2 min-w-[200px] xl:w-[100%]">
        <h4 className="font-extrabold text-xl leading-6 px-4 dark:text-darkText">
          Trending
        </h4>
        {status === "loading" ? (
          <Spinner />
        ) : // if there are no trending posts display a message
        trendingPosts?.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-xl font-bold dark:text-darkText">
              No trending posts
            </h1>
            <p className="text-gray-400 py-2">Check back later</p>
          </div>
        ) : (
          // if there are trending posts display them
          <AnimatePresence>
            {trendingPosts?.slice(0, postNum).map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <Trending key={post._id} post={post} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        {status !== "loading" && trendingPosts?.length > 3 && (
          <button
            onClick={() => setPostNum(postNum + 3)}
            className="text-red-300 pl-4 pb-3 hover:text-red-400"
          >
            Show more
          </button>
        )}
        {
          // if end of results display the show less button
          status !== "loading" &&
            trendingPosts?.length > 3 &&
            trendingPosts?.length <= postNum && (
              <button
                onClick={() => setPostNum(3)}
                className="text-red-300 pl-4 pb-3 hover:text-red-400"
              >
                Show less
              </button>
            )
        }
      </div>
      <div className="sticky top-16 text-gray-700 space-y-3 bg-gray-100 dark:bg-darkCard pt-2 rounded-xl min-w-[200px] xl:w-[100%]">
        <h4 className="font-extrabold text-xl leading-6 px-4 dark:text-darkText">
          Featured Artists
        </h4>
        {status === "loading" ? (
          <Spinner />
        ) : // if there are no random users display a message
        randomUsersResults?.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-xl font-bold dark:text-darkText">
              No featured artists
            </h1>
            <p className="text-gray-400 py-2">Check back later</p>
          </div>
        ) : (
          // if there are random users display them
          <AnimatePresence>
            {randomUsersResults?.slice(0, randomUserNum).map((randomUser) => (
              <motion.div
                key={randomUser.login.username}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <div
                  key={randomUser.login.username}
                  className="flex items-center px-4 py-2  cursor-pointer hover:bg-gray-200 dark:hover:bg-darkHover transition duration-500 ease-out"
                >
                  <Image
                    referrerPolicy="no-referrer"
                    className="rounded-full h-[50px] w-[50px]"
                    width="50"
                    height="50"
                    unoptimized={true}
                    loader={({ src }) => src}
                    src={randomUser.picture.thumbnail}
                    alt=""
                  />
                  <div className="truncate ml-4 leading-5">
                    <h4 className="font-bold hover:underline dark:text-darkText text-[14px] truncate">
                      {randomUser.login.username}
                    </h4>
                    <h5 className="text-[13px] text-gray-500  truncate">
                      {randomUser.name.first + " " + randomUser.name.last}
                    </h5>
                  </div>
                  <button className="ml-auto bg-black dark:bg-white dark:text-gray-950 text-white rounded-full text-sm px-3.5 py-1.5 font-bold">
                    Follow
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        {status !== "loading" && randomUsersResults?.length > 3 && (
          <button
            onClick={() => setRandomUserNum(randomUserNum + 3)}
            className="text-red-300 pl-4 pb-3 hover:text-red-400"
          >
            Show more
          </button>
        )}
        {
          // if end of results display the show less button
          status !== "loading" &&
            randomUsersResults?.length > 3 &&
            randomUserNum > 3 && (
              <button
                onClick={() => setRandomUserNum(3)}
                className="text-red-300 pl-4 pb-3 hover:text-red-400"
              >
                Show less
              </button>
            )
        }
      </div>
    </div>
  );
}
