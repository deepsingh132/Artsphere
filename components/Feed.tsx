"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Key, useEffect, useState } from "react";
import Input from "./Input";
import Post from "./Post";
import Navbar from "./Navbar";
import axios from "axios";
import { useSession } from "next-auth/react";
import Spinner from "./Spinner";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Modal } from "./modal";
import CommentModal from "./CommentModal";
import { toastSuccess, toastError } from "./Toast";
import PostModal from "./PostModal";

export default function Feed({ type }) {
  const [posts, setPosts] = useState([]) as any;
  const [loading, setLoading] = useState(true);
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

  // call your useEffect
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

  useEffect(() => {
    async function getPosts() {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts`
        );
        if (!type) {
          setPosts(res.data.posts);
          setLoading(false);
          return;
        }
        const filtered = res.data.posts.filter(
          (post: { category: any }) => post.category === type
        );
        setPosts(filtered);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toastError("Error loading posts", undefined);
      }
    }
    getPosts();
  }, [type]);

  const updatePosts = (operation: string, newPost: any, id: any) => {
    if (operation === "delete") {
      setPosts(posts.filter((post: { _id: any }) => post._id !== id));
      return;
    }
    if (operation === "update") {
      setPosts([newPost, ...posts]);
      return;
    }
    // if a reply is added to a post
    if (operation === "reply") {
      // find the post and add the reply to it
      const post = posts.find((post: { _id: any }) => post._id === id);
      // check if the post already has a comment with the same id
      const comment = post.comments.find(
        (comment: { _id: any }) => comment._id === newPost._id
      );
      // if the comment doesn't exist, add it
      if (!comment) {
        post.comments.push(newPost);
      }
      return;
    }
  };

  if (!loading && posts.length === 0) {
    return (
      <div className="xl:ml-[350px] h-full border-l border-r border-lightBorderColor dark:border-darkBorderColor  xl:min-w-[680px] sm:ml-[82px] justify-center sm:w-[calc(100%-83px)] w-full content-center items-center flex-grow max-w-2xl">
        <Navbar title={undefined} />
        <Input
          updatePosts={updatePosts}
          text={undefined}
          id={undefined}
          style={undefined}
          phoneInputModal={undefined} setCommentModalState={undefined}        />
        <div className="flex flex-col items-center justify-center h-[calc(100%-50%)]">
          <h1 className="text-2xl font-bold text-gray-700 dark:text-darkText">
            No posts found
          </h1>
          <h2 className="text-lg text-gray-500">Try posting something!</h2>
        </div>
      </div>
    );
  }

  if (!loading || status !== "loading") {
    // set overFlow to visible
    document.body.style.overflow = "visible";
  }

  return (
    <>
      <div className="mainContent flex flex-col xl:ml-[350px] border-l border-r border-lightBorderColor dark:border-darkBorderColor w-screen sm:max-w-[calc(100vw-82px)] md:max-w-2xl xl:min-w-[680px] sm:ml-[82px] lg:max-w-[680px] flex-grow">
        <Navbar title={undefined} />
        <Input
          updatePosts={updatePosts}
          text={undefined}
          id={undefined}
          style={undefined}
          phoneInputModal={undefined}
          setCommentModalState={undefined}
        />

        {session && (
          // an absolute floating button to create a post on mobile
          <div className="fixed sm:hidden bottom-5 right-5 z-40">
            <button
              type="button"
              role="btn"
              onClick={() => setModalOpen(true)}
              className="flex self-center bg-primary rounded-full h-[56px] w-[56px] hover:brightness-90 hover:shadow-md transition-all duration-300 ease-in-out outline-none items-center justify-center"
            >
              <span className="flex items-center font-black">
                <PencilSquareIcon className="h-6 w-6 text-text" />
              </span>
            </button>
          </div>
        )}

        {loading && status !== "loading" ? (
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

        <AnimatePresence>
          {posts
            ?.slice(0, 20)
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
            .map((post: { _id: Key | null | undefined }) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <Post
                  key={post?._id}
                  id={post?._id}
                  post={post}
                  updatePosts={updatePosts}
                />
              </motion.div>
            ))}
        </AnimatePresence>

        {modalOpen && (
          <Modal closeModal={closeModal}>
            <div className="max-w-full p-3">
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
