"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Key, useEffect, useState } from "react";
import Input from "./Input";
import Post from "./Post";
import Navbar from "./Navbar";
import { useSession } from "next-auth/react";
import Spinner from "./Spinner";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Modal } from "./modal";
import CommentModal from "./CommentModal";
import { toastError } from "./Toast";
import PostModal from "./PostModal";
import useSWR from "swr";
import { backendUrl } from "@/app/utils/config/backendUrl";


export default function Feed({ type }) {
  // fetcher function for useSWR
  const fetcher = (url: RequestInfo | URL) =>
    fetch(url).then((res) => {
      if (!res.ok) {
        toastError("Error loading posts", undefined);
      }
      return res.json();
    });



  const key = type && type !=="for-you" ? `${backendUrl}/posts?type=${type}` : `${backendUrl}/posts`;
  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    // refreshInterval: 30000,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const { status, data: session } = useSession();
  const [width, setWidth] = useState<number | undefined>(undefined);

  const handleWindowSizeChange = () => {
    setWidth(window?.innerWidth);
  };

  // set initial width on page load
  useEffect(() => {
    handleWindowSizeChange();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  function closeModal() {
    setModalOpen(false);
  }

  // close modal if screen size is greater than sm
  useEffect(() => {
    if (width && width > 640) {
      closeModal();
    }
  }, [modalOpen, width]);

  if (error) {
    toastError("Error loading posts", undefined);
  }

  function updatePosts(operation: string, newPost: any, id: any) {
    // an update function to update the feed optimistically
    if (operation === "delete") {
      mutate(
        (data: { posts: any[]; }) => ({
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
        }
        , {
          revalidate: false,
          rollbackOnError: true,
        }
      );
    }
    if (operation === "reply") {
      mutate({
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
  };

  if (!isLoading && data?.posts?.length === 0) {
    return (
      <div
        data-testid="feed"
        className="xl:ml-[350px] h-full border-l border-r border-lightBorderColor dark:border-darkBorderColor  xl:min-w-[680px] sm:ml-[82px] justify-center sm:w-[calc(100%-82px)] w-screen items-center flex-grow max-w-2xl">
        <Navbar title={undefined} />
        <Input
          updatePosts={updatePosts}
          text={undefined}
          id={undefined}
          style={undefined}
          phoneInputModal={undefined}
          setCommentModalState={undefined}
        />
        <div className="flex flex-col items-center justify-center h-[calc(100%-50%)]">
          <h1 className="text-2xl font-bold text-gray-700 dark:text-darkText">
            No posts found
          </h1>
          <h2 className="text-lg text-gray-500">Try posting something!</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        data-testid="feed"
        role="feed"
        className="mainContent flex flex-col xl:ml-[350px] border-l border-r border-lightBorderColor dark:border-darkBorderColor w-screen sm:max-w-[calc(100vw-82px)] md:max-w-2xl xl:min-w-[680px] sm:ml-[82px] lg:max-w-[680px] flex-grow">
        { type === "for-you" ?
          <Navbar title={"For-you"} />
          : <Navbar title={undefined} />
        }
        {
          type !== "for-you" &&
          <Input
            updatePosts={updatePosts}
            text={undefined}
            id={undefined}
            style={undefined}
            phoneInputModal={undefined}
            setCommentModalState={undefined}
          />
        }

        {session && (
          // an absolute floating button to create a post on mobile
          <div className="fixed sm:hidden bottom-5 right-5 z-40">
            <button
              data-testid="feed-fab"
              type="button"
              role="btn"
              onClick={() => setModalOpen(true)}
              className="flex self-center bg-primary rounded-full h-[56px] w-[56px] hover:brightness-90 hover:shadow-md transition-all duration-300 ease-in-out outline-none items-center justify-center"
            >
              <span className="flex items-center font-black">
                <PencilSquareIcon
                  data-testid="feed-fab-icon"
                  className="h-6 w-6 text-text" />
              </span>
            </button>
          </div>
        )}

        {isLoading && status !== "loading" ? (
          <div className="flex pt-4">
            <Spinner />
          </div>
        ) : (
          status === "loading" && (
            <>
              <Spinner />
            </>
          )
        )}
        {
          type === "for-you" ?
          <AnimatePresence>
            {data?.posts
              ?.slice(0, 40)
                .sort(
                (
                  a: { likes: any[] },
                  b: { likes: any[] }
                ) => b.likes.length - a.likes.length
              )
              .map((post: Post) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                >
                  <Post
                    key={post?._id}
                    id={post?._id || ""}
                    post={post}
                    updatePosts={updatePosts}
                  />
                </motion.div>
              ))}
          </AnimatePresence>
          :
          <AnimatePresence>
            {data?.posts
              ?.slice(0, 40)
              .sort(
                (
                  a: { createdAt: string | number | Date },
                  b: { createdAt: string | number | Date }
                ) => {
                  const dateA = new Date(a.createdAt) as any;
                  const dateB = new Date(b.createdAt) as any;
                  return dateB - dateA; // Sort in descending order
                }
              )
              .map((post: Post) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                >
                  <Post
                    key={post?._id}
                    id={post?._id || ""}
                    post={post}
                    updatePosts={updatePosts}
                  />
                </motion.div>
              ))}
          </AnimatePresence>

        }
        {modalOpen && (
          <Modal closeModal={closeModal}>
            <div
              data-testid="feed-fab-modal"
              className="max-w-full p-3">
              <h1 className="text-2xl font-bold text-text dark:text-darkText">
                Create a post
              </h1>
              <div className="flex-1 ">
                <Input
                  updatePosts={updatePosts}
                  style={`flex w-full mt-4 min-h-[50px] max-h-[100px] text-[15px] dark:bg-darkBg dark:text-darkText`}
                  phoneInputModal={closeModal}
                  text={undefined}
                  id={undefined}
                  setCommentModalState={undefined}
                />
              </div>
            </div>
          </Modal>
        )}
      </div>
      <CommentModal updatePosts={updatePosts} type={undefined} />
      <PostModal updatePosts={updatePosts} type={"post"} />
    </>
  );
}
