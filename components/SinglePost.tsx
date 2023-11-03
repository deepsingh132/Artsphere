"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import Post from "@/components/Post";
import Comment from "@/components/Comment";
import axios from "axios";
import Input from "./Input";
import Spinner from "./Spinner";
import CommentModal from "./CommentModal";

export default function SinglePost({ id }) {
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const { status, data: session } = useSession();
  const username = session?.user?.email.split("@")[0];

  useEffect(() => {
    if (status === "authenticated") {
      setCurrentUser(session.user);
    } else {
      setCurrentUser(null);
      setIsFetching(false);
    }
  }, [status, session]);

  useEffect(() => {
    const getPost = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/${id}`
      );
      setPost(res?.data?.post);
      setComments(res?.data?.post?.comments);
      setIsFetching(false);
    };
    if (currentUser) {
      getPost();
    }
  }, [currentUser, id, username]);

  useEffect(() => {
    if (!currentUser) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [currentUser]);

  const updatePosts = (operation: string, newComment: any, id: any) => {
    if (operation === "delete") {
      setComments(comments.filter((comment: { _id: any }) => comment._id !== id));
      return;
    }
    if (operation === "reply") {
      setComments([newComment, ...comments]);
      return;
    }
  };


  return (
    <div>
      {isFetching ? ( // Check if isLoading is true
        <div className="flex items-center justify-center h-screen">
          <Spinner />
        </div>
      ) : currentUser ? ( // Check if currentUser is true
        <div className="dark:bg-darkBg max-w-[100vw]">
          <Post id={id} post={post} updatePosts={undefined} />
          <Input
              text={"Post your reply"}
              id={id}
              updatePosts={updatePosts}
              style={undefined}
              phoneInputModal={undefined} setCommentModalState={undefined}          />
          {comments?.length > 0 && (
            <div>
              <AnimatePresence>
                {comments
                  ?.slice(0, 10)
                  .sort((a: { timestamp: number; }, b: { timestamp: number; }) => b.timestamp - a.timestamp)
                  .map((comment: any) => (
                    <motion.div
                      key={comment._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                    >
                      <Comment
                        key={comment._id}
                        commentId={comment._id}
                        originalPostId={id}
                        updatePosts={updatePosts}
                        comment={comment}
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      ) : (
        <>
          {!isFetching && status !== "loading" && currentUser === null && (
            <div className="flex items-center justify-center h-screen">
              <h1 className="text-2xl font-bold text-gray-500">
                Please sign in to view this page
              </h1>
            </div>
          )}
        </>
      )}

      <CommentModal updatePosts={updatePosts} type={undefined} />

    </div>
  );
}
