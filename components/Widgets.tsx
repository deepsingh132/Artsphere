'use client'

import { MagnifyingGlassIcon as SearchIcon } from "@heroicons/react/24/outline";
import Trending from "./Trending";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Spinner from "./Spinner";

export default function Widgets({ trendingPosts, randomUsersResults }) {
  const [postNum, setPostNum] = useState(3);
  const [randomUserNum, setRandomUserNum] = useState(3);
  const { status } = useSession();


  return (
    <div
      className={`dark:bg-darkBg hidden lg:inline ml-[30px] pb-4 ${
        status == "loading" ? "" : ""
      }  mr-[30px] space-y-5 min-w-[200px] max-w-[350px] xl:w-[350px]`}
    >
      <div className="searchBox min-w-[200px] xl:w-[100%] sticky top-0 bg-white dark:bg-darkBg py-2 z-30">
        <div className="flex items-center p-3 w-full  rounded-full relative !outline-none">
          <SearchIcon className="h-5 z-50 text-gray-500" />
          <input
            className="absolute w-[100%] focus:ring-0 focus:border-red-400 inset-0 rounded-full pl-11 border-gray-500 text-gray-700 dark:text-darkText focus:shadow-lg focus:bg-white bg-gray-100 dark:bg-darkCard"
            type="text"
            placeholder="Search art/ists"
          />
        </div>
      </div>

      <div className="text-gray-700 space-y-3 bg-gray-100 dark:bg-darkCard rounded-xl pt-2 min-w-[200px] xl:w-[100%]">
        <h4 className="font-extrabold text-xl leading-6 px-4 dark:text-darkText">
          Trending
        </h4>
        {status === "loading" ? (
          <Spinner />
        ) : (
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
        {status !== "loading" && trendingPosts?.length > 0 && (
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
            trendingPosts?.length > 0 &&
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
        ) : (
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
        {status !== "loading" && randomUsersResults?.length > 0 && (
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
            randomUsersResults?.length > 0 &&
            randomUsersResults?.length <= randomUserNum && (
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
