"use client";

import Image from "next/image";
import {
  BellIcon,
  CalendarDaysIcon,
  LinkIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Post from "@/components/Post";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import Spinner from "./Spinner";
import Navbar from "./Navbar";
import nullImg from "@/public/null.png";
import axios from "axios";
import {toastSuccess, toastError} from "./Toast";
import { backendUrl } from "@/app/utils/config/backendUrl";
import useSWR from "swr";

export default function UserProfileData({}) {
  const pathname = usePathname();
  const username = pathname.split("/")[1];
  const [isFetching, setIsFetching] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [tab, setTab] = useState("showcase");
  const { status, data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(null) as any;
  const [isVerified, setIsVerified] = useState(false);

  const [profileData, setProfileData] = useState(null) as any;

  // fetcher function for useSWR
  const fetcher = (url: RequestInfo | URL) =>
    fetch(url).then((res) => {
      if (!res.ok) {
        toastError("Error loading posts", undefined);
      }
      return res.json();
    });

  const key = `${backendUrl}/posts/username/${username}`;
  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    // refreshInterval: 30000,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  useEffect(() => {
    const checkFollowing = () => {
      if (profileData?.user?.followers?.includes(session?.user?.id)) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    };
    if (profileData && session?.user?.id) {
      checkFollowing();
    }
  }, [profileData, session?.user?.id]);

  useEffect(() => {
    const checkVerification = () => {
      if (profileData?.user?.verified) {
        setIsVerified(true);
      } else {
        setIsVerified(false);
      }
    };
    if (profileData && session?.user?.id) {
      checkVerification();
    }
  }, [profileData, session?.user?.id]);

  useEffect(() => {
    async function getProfileData() {
      try {
        const res = await fetch(`${backendUrl}/user/${username}`);
        const data = await res.json();
        if (data.message === "User not found") {
          setIsFetching(false);
          return;
        }
        setProfileData(data);
        setLikes(data?.user?.likes);
        setIsFetching(false);
      } catch (error) {
        setIsFetching(false);
        toastError(error.message, undefined);
      }
    }
    getProfileData();
  }, [username]);

  useEffect(() => {
    if (data) {
      setPosts(data.posts);
    }
    if (data?.message === "No posts found") {
      toastError("No posts found", undefined);
    }

    if (error) {
      toastError("Error loading posts", undefined);
    }
  }, [data, error]);

  useEffect(() => {
    // get all liked posts's data with the ids from likes array
    async function getLikedPosts() {
      try {
        const likedPostsData = [] as any;

        // Iterate through the liked post IDs and fetch each post's data
        for (const postId of likes) {
          const res = await fetch(`${backendUrl}/posts/${postId}`);
          if (res.status === 404) {
            continue;
          }
          const postData = (await res.json()) as any;
          if (postData.message !== "No post found") {
            // Add the post data to the likedPostsData object
            likedPostsData.push(postData?.post);
          }
        }
        // make the likedPosts state variable equal an array of objects
        setLikedPosts(likedPostsData);
      } catch (error) {
        toastError(error.message, undefined);
      }
    }
    if (profileData && likes?.length > 0) {
      getLikedPosts();
    }
  }, [profileData, likes, username, tab]);

  if (!isFetching && !profileData) {
    document.body.style.overflow = "auto";
  }

  const userNotFound = () => {
    // hide overflow
    document.body.style.overflow = "hidden";
    return (
      <>
        <Navbar title="Back" />
        <div className="flex flex-col w-full items-center justify-center h-screen">
          <Image
            referrerPolicy="no-referrer"
            src={nullImg}
            alt="404"
            width={500}
            height={500}
            className="object-cover sm:max-w-[500px] sm:max-h-[500px]"
          />
          <h1 className="text-6xl font-bold dark:text-darkText">404</h1>
          <h1 className="text-2xl font-bold dark:text-darkText">
            Page not found
          </h1>
          <p className="text-gray-500">Please try again</p>
        </div>
      </>
    );
  };

  const applyForVerification = async () => {
    if (isVerified) {
      alert("You are already verified!");
      return;
    }
    // ask for verification with alert box yes or no
    const confirmation = window.confirm(
      "Are you sure you want to apply for verification?"
    );
    if (!confirmation) {
      return;
    }
    // if yes, send a request to the backend
    try {
      const res = await axios.put(
        `${backendUrl}/user/${username}/verify`,
        {
          userId: session?.user?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        }
      );
      if (res.status === 200) {
        toastSuccess("Verification request sent!", undefined);
        // add delay and verify the user
        setTimeout(() => {
          setIsVerified(true);
        }, 3000);
      }
    } catch (error) {
      toastError(error.message, undefined);
    }
  };

  function convertNumbers(labelValue: number | bigint) {
    const language = "en";
    return Intl.NumberFormat(language, { notation: "compact" }).format(
      labelValue
    );
  }

 async function followUser() {
    if (!session) {
      alert("You must be logged in to follow a user!");
      return;
    }

    if (session?.user?.email === profileData?.user?.email) {
      alert("You cannot follow yourself!");
      return;
    }

    setIsFollowing(!isFollowing); // optimistic updates
    if (!isFollowing) {
      profileData?.user?.followers?.push(session?.user?.id);
    }
    if (isFollowing) {
      const index = profileData?.user?.followers?.indexOf(session?.user?.id);
      if (index > -1) {
        profileData?.user?.followers?.splice(index, 1);
      }
    }

    const res = await axios.put(
      `${backendUrl}/user/${username}/follow`,
      {
        action: "follow",
        userId: session?.user?.id,
        followFrom: session?.user?.id,
        followTo: profileData?.user?._id,
      },
      {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }
    );
    // roleback all optimistic updates if error
    if (res.status !== 200 && isFollowing) {
      setIsFollowing(!isFollowing);
      profileData?.user?.followers?.push(session?.user?.id);
    }
    if (res.status !== 200 && !isFollowing) {
      setIsFollowing(!isFollowing);
      const index = profileData?.user?.followers?.indexOf(session?.user?.id);
      if (index > -1) {
        profileData?.user?.followers?.splice(index, 1);
      }
    }
  }

  function updatePosts(operation: string, newPost: any, id: any) {
    // an update function to update the feed optimistically
    if (operation === "delete") {
      mutate(
        (data: { posts: any[] }) => ({
          posts: data.posts.filter((post: { _id: any }) => post._id !== id),
        }),
        {
          revalidate: false,
          rollbackOnError: true,
        }
      );
    }
    if (operation === "update" || operation === "add") {
      mutate(
        {
          posts: [newPost, ...data?.posts],
        },
        {
          revalidate: false,
          rollbackOnError: true,
        }
      );
    }
    if (operation === "reply") {
      mutate(
        {
          posts: data?.posts.map((post: any) => {
            if (post._id === id) {
              post.comments?.push(newPost);
            }
            return post;
          }),
        },
        {
          revalidate: false,
          rollbackOnError: true,
        }
      );
    }
  }

  return isFetching ? (
    <Spinner />
  ) : (
    <div>
      {profileData === null && !isLoading ? (
        userNotFound()
      ) : (
        <>
          <Navbar title={profileData?.user.name} />
          <div className="coverPhoto flex max-w-full">
            <Image
              referrerPolicy="no-referrer"
              width={768}
              height={276}
              alt="cover"
              loader={({ src }) => src}
              src={
                "https://welc.ie/wp-content/uploads/2018/01/placeholder-1.png"
              }
              className=" w-full h-[276px] object-cover"
            />
          </div>
          <div className=" profilePhoto flex justify-start px-4 -mt-16">
            <Image
              referrerPolicy="no-referrer"
              width="128"
              height="128"
              alt="profile"
              loader={({ src }) => src}
              src={profileData?.user.image}
              className="rounded-full w-32 h-32 object-cover border-4 border-white"
            />

            <div className="followButtonContainer flex w-full justify-end items-end">
              {status !== "loading" &&
                session?.user?.email !== profileData?.user?.email && (
                  <>
                    {isFollowing !== null && (
                      <button
                        onClick={() => followUser()}
                        className={`followButton flex items-center text-sm sm:text-base bg-primary min-w-[36px] min-h-[36px] hover:brightness-90 transition-colors text-white font-bold px-4 rounded-full ${
                          isFollowing ? "primary" : "bg-red-400"
                        } `}
                      >
                        <span className="flex items-center">
                          {isFollowing ? (
                            <>
                              <BellIcon className="h-5 mr-1" />
                              Following
                            </>
                          ) : (
                            "Follow"
                          )}
                        </span>
                      </button>
                    )}
                  </>
                )}
            </div>
          </div>

          <div className="profileInfo overflow-hidden text-ellipsis break-words flex flex-col justify-start items-start mx-4 mt-4">
            <div className="username mb-3">
              <div className="flex items-center">
                <h1 className="text-xl font-black dark:text-darkText">
                  {profileData?.user?.name}
                </h1>

                {!isVerified &&
                  session?.user?.email === profileData?.user?.email && (
                    <div className="getVerified flex items-center">
                      <span
                        className="text-sm text-gray-500 cursor-pointer font-medium hover:underline ml-4"
                        onClick={() => {
                          applyForVerification();
                        }}
                      >
                        Get verified!
                      </span>
                    </div>
                  )}

                {isVerified && (
                  // Verified Badge with a yellow gradient bg-gradient-to-l from-yellow-200 via-yellow-400 to-yellow-700
                  <CheckBadgeIcon className="h-6 w-6 ml-1 text-primary" />
                )}
              </div>
              <h2 className=" text-base text-gray-500 font-normal -mt-1">
                @{profileData?.user?.email?.split("@")[0]}
              </h2>
            </div>
            <p className="text-sm font-normal text-gray-800 dark:text-darkText">
              {profileData?.user.bio}
            </p>
            <div className="flex flex-col mt-4 justify-between w-full">
              <div className="userInfo w-full whitespace-nowrap truncate flex items-center text-gray-500 mb-4">
                <div className="location truncate flex sm:mr-8 mx-2 items-center">
                  <MapPinIcon className=" h-5 mr-1" />
                  <span className=" truncate"> {" Bay Area, CA "}</span>
                </div>
                <div className="link flex truncate sm:mr-8 mx-2 items-center">
                  <a
                    href="https://www.instagram.com/"
                    className="flex truncate"
                  >
                    <LinkIcon className=" h-5 mr-1" />
                    <span className="truncate">Instagram</span>
                  </a>
                </div>
                <div className="date flex truncate sm:mr-8 mx-2 items-center">
                  <CalendarDaysIcon className=" h-5 mr-1" />
                  <span className=" truncate">
                    {" Joined " +
                      new Date(profileData?.user.createdAt).getFullYear()}
                  </span>
                </div>
              </div>
              <div className="flex align-middle items-center">
                <div className="flex flex-col items-center justify-center mr-4">
                  <h1 className="font-bold dark:text-darkText">
                    {convertNumbers(profileData?.user?.following?.length)}
                  </h1>
                  <h2 className="text-sm text-gray-500">Following</h2>
                </div>
                <div className="flex flex-col items-center justify-center mr-4">
                  <h1 className="font-bold dark:text-darkText">
                    {convertNumbers(profileData?.user?.followers?.length)}
                  </h1>
                  <h2 className="text-sm text-gray-500">Followers</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="profileTabs flex flex-col items-center mt-1 pt-4">
            <div className="tabs font-semibold flex w-full justify-evenly dark:text-darkText">
              <div
                onClick={() => setTab("showcase")}
                className={`hover:cursor-pointer ${
                  tab != "showcase"
                    ? "hoverEffect min-h-[0px]"
                    : "bg-red-400 text-white"
                } px-5 py-2 rounded-full`}
              >
                Showcase
              </div>
              <div
                onClick={() => setTab("likes")}
                className={`${
                  tab != "likes"
                    ? "hoverEffect !min-h-[0px] text-text dark:text-darkText"
                    : "bg-red-400 text-white"
                }
             text-black px-5 py-2 rounded-full cursor-pointer`}
              >
                Likes
              </div>
            </div>
            <div className="flex flex-col w-full justify-center mt-2 border-t">
              {isLoading && (
                <div className="flex h-full justify-center items-center pt-8">
                  <Spinner />
                </div>
              )}

              {tab === "showcase" && (
                <AnimatePresence>
                  {posts
                    ?.slice(0, 30)
                    .sort(
                      (a: any, b: any) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    ) // Sort by createdAt in descending order
                    .map((post: any) => (
                      <motion.div
                        key={post._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                      >
                        <Post
                          key={post._id}
                          id={post._id}
                          post={post}
                          updatePosts={updatePosts}
                        />
                      </motion.div>
                    ))}
                  {posts?.length === 0 && !isLoading && (
                    <div className="flex sm:h-[80vh] flex-col lg:p-28 items-center justify-center mt-8">
                      <Image
                        src={nullImg}
                        referrerPolicy="no-referrer"
                        alt="404"
                        width="500"
                        height="500"
                        className="object-cover"
                      />
                      <h1 className="text-2xl font-bold dark:text-darkText">
                        No posts found
                      </h1>
                      <p className="text-gray-500">
                        Create some posts to see them here
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              )}
              {tab === "likes" && (
                <AnimatePresence>
                  {likedPosts
                    ?.slice(0, 30)
                    .sort(
                      (a: any, b: any) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    ) // Sort by createdAt in descending order
                    .map((post: any) => (
                      <motion.div
                        key={post._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                      >
                        <Post
                          key={post._id}
                          id={post._id}
                          post={post}
                          updatePosts={updatePosts}
                        />
                      </motion.div>
                    ))}

                  {likedPosts?.length === 0 && (
                    <div className="flex flex-col lg:p-28 items-center justify-center mt-8">
                      <Image
                        src={nullImg}
                        referrerPolicy="no-referrer"
                        alt="404"
                        width={500}
                        height={500}
                        className="object-cover sm:max-w-[500px] sm:max-h-[500px]"
                      />
                      <h1 className="text-2xl font-bold dark:text-darkText">
                        No liked posts
                      </h1>
                      <p className="text-gray-500">
                        Like some posts to see them here
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
