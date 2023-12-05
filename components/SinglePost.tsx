"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import Post from "@/components/Post";
import Comment from "@/components/Comment";
import Input from "./Input";
import Spinner from "./Spinner";
import CommentModal from "./CommentModal";
import useSWR from "swr";
import { backendUrl } from "@/app/utils/config/backendUrl";

export default function SinglePost({ id }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const { status, data: session } = useSession();

  const fetcher = (url: RequestInfo | URL) =>
    fetch(url).then((res) => {
      if (!res.ok) {
        throw Error("Error loading post");
      }
      return res.json();
    });

  const { data, error, isLoading, mutate } = useSWR(
    `${backendUrl}/posts/${id}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshWhenOffline: true,
    }
  );

  useEffect(() => {
    if (status === "authenticated") {
      setCurrentUser(session.user);
      setIsFetching(false);
    } else {
      setCurrentUser(null);
      setIsFetching(false);
    }
  }, [status, session]);

  // useEffect(() => {
  //   if (data?.post) {
  //     setComments(data?.post?.comments);
  //     setIsFetching(false);
  //   }
  // }, [data?.post]);

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
      mutate(
        (data) => ({
          post: {
            ...data.post,
            comments: data.post.comments.filter(
              (comment: { _id: any }) => comment._id !== id
            ),
          },
        }),
        {
          revalidate: false,
          rollbackOnError: true,
        }
      );
      //setComments(comments.filter((comment: { _id: any }) => comment._id !== id));
    }
    if (operation === "add" || operation === "reply") {
      mutate(
        (data) => ({
          post: {
            ...data.post,
            comments: [newComment, ...data.post.comments],
          },
        }),
        {
          revalidate: false,
          rollbackOnError: true,
        }
      );
      // setComments([newComment, ...comments]);
    }
  };

  // if post is deleted or doesn't exist
  if (error && !isLoading && !isFetching) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-gray-500">
          {error ? error.message : "Post not found"}
        </h1>
      </div>
    );
  }

  return (
    <div>
      {isFetching ? ( // Check if isLoading is true
        <div className="flex items-center justify-center h-screen">
          <Spinner />
        </div>
      ) : currentUser ? ( // Check if currentUser is true
        <div className="dark:bg-darkBg max-w-[100vw]">
          <Post id={id} post={data?.post} updatePosts={undefined} />
          <Input
            text={"Post your reply"}
            id={id}
            updatePosts={updatePosts}
            style={undefined}
            phoneInputModal={undefined}
            setCommentModalState={undefined}
          />
          {data?.post?.comments?.length > 0 && (
            <div>
              <AnimatePresence>
                {data?.post?.comments
                  ?.slice(0, 10)
                  .sort(
                    (a: { timestamp: number }, b: { timestamp: number }) =>
                      b.timestamp - a.timestamp
                  )
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
