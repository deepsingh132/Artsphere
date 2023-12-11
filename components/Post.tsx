"use client";

import {
  ChartBarIcon,
  ChatBubbleOvalLeftEllipsisIcon as ChatIcon,
  EllipsisHorizontalIcon as DotsHorizontalIcon,
  HeartIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/24/solid";
import Moment from "react-moment";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "@/app/atom/modalAtom";
import YoutubeEmbed from "./YoutubeEmbed";
import { toastError, toastSuccess } from "./Toast";
import { deletePost, likePost } from "@/app/utils/postUtils";

export default function Post({ post, id, updatePosts }) {
  const [hasLiked, setHasLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useRecoilState(modalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  const { status, data: session } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      setCurrentUser(session?.user);
    } else {
      setCurrentUser(null);
    }
  }, [status, session]);

  // check if post's likes array contains the logged in user's id
  useEffect(() => {
    // set the likes state
    if (post?.likes?.includes(session?.user?.id)) {
      setHasLiked(true);
    }
  }, [post, session?.user?.id]);

  async function likePostFunc() {
    if (currentUser) {
      setHasLiked(!hasLiked); //optimistic update
      if (!hasLiked) {
        post?.likes?.push(session?.user?.id);
      }
      if (hasLiked) {
        const index = post?.likes?.indexOf(session?.user?.id);
        if (index > -1) {
          post?.likes?.splice(index, 1);
        }
      }
      const res = await likePost(id, session?.user?.id ,session?.user?.accessToken);

      //rollback optimistic update if error
      if (!res) {
        toastError("Error liking post", undefined);
        setHasLiked(hasLiked);
        const index = post?.likes?.indexOf(session?.user?.id);
        if (index > -1) {
          post?.likes?.splice(index, 1);
        }
      }
    } else {
      // signIn();
      router.push("/login");
    }
  }

  async function deletePostFunc() {
    if (window.confirm("Are you sure you want to delete this post?")) {
      updatePosts("delete", null, id); // optimistic update
      const res = await deletePost(id, session?.user?.accessToken);

      //rollback optimistic update if error
      if (!res) {
        toastError("Error deleting post", undefined);
        updatePosts("add", post, id);
      } else {
        toastSuccess("Post deleted", undefined);
      }
    }
  }

  return (
    <div
      data-testid="post"
      role="post"
      className={`flex hover:bg-gray-50 dark:hover:bg-darkHover transition-colors ease-in duration-300 md:w-full sm:p-3 p-2 truncate cursor-pointer first:pt-4 border-b border-lightBorderColor dark:border-darkBorderColor`}
    >
      {/* user image */}
      <Image
        data-testid="post-user-image"
        onClick={() => router.push(`/${post?.username}`)}
        className=" h-10 w-10 rounded-full sm:ml-2 ml-1"
        width="50"
        height="50"
        src={post?.userImg}
        alt="user-img"
      />
      {/* right side */}
      <div className="flex-1 md:ml-3 ml-2 mr-3 sm:mr-7 max-w-[calc(100vw-80px)]">
        {/* Header */}

        <div className="flex justify-between items-start truncate">
          {/* post user info */}
          <div className="flex truncate">
            <h4 className="font-bold text-sm sm:text-base dark:text-darkText mr-1">
              {post?.name}
            </h4>

            <span
              data-testid="post-username"
              className="text-sm text-gray-500 hover:underline truncate sm:text-[15px] mr-1"
              onClick={() => router.push(`/${post?.username}`)}
            >
              @{post?.username}
            </span>

            <span className="mt-[-4px] text-base font-base sm:text-xl text-gray-500">
              ·
            </span>
            <span className="text-sm text-gray-500 sm:text-[15px] ml-1">
              <Moment fromNow>{post?.createdAt}</Moment>
            </span>
          </div>

          {currentUser && session?.user?.id === post?.authorID && (
            <div className="mt-[-8px]">
              <DotsHorizontalIcon className="h-9 text-gray-500 hoverEffect !min-h-0 !min-w-0 hover:bg-sky-100 hover:text-sky-500 p-2 " />
            </div>
          )}
        </div>

        {/* post text */}

        <div
          data-testid="post-content"
          onClick={() => router.push(`/posts/${id}`)}>
          <p
            data-testid="post-text"
            onClick={() => router.push(`/posts/${id}`)}
            className="text-gray-800 dark:text-darkText whitespace-normal text-[15px] sm:mr-2 sm:text-[16px] mb-2"
          >
            {post?.content}
          </p>

          {/* post media */}

          {
            // check if post?.url exists
            post?.url && !post?.url?.includes("youtube") && (
              <Image
                onClick={() => router.push(`/posts/${id}`)}
                data-testid="post-image"
                className="rounded-2xl max-h-80 w-[100%] sm:w-full object-cover"
                width={500}
                height={500}
                src={post?.url}
                alt="img"
              />
            )
          }

          {post?.url && post?.url?.includes("youtube") && (
            <YoutubeEmbed
              embedId={post?.url?.split("v=")[1]} />
          )}
        </div>

        {/* icons */}

        <div className="flex justify-between text-gray-500 ml-[-8px]">
          <div className="flex items-center select-none">
            <ChatIcon
              data-testid="post-comment-button"
              onClick={() => {
                if (!currentUser) {
                  // signIn();
                  router.push("/login");
                } else {
                  setPostId(id);
                  setIsModalOpen(!isModalOpen);
                }
              }}
              className="h-9 hoverEffect !min-h-0 !min-w-0  p-2 hover:text-sky-500 hover:bg-sky-100"
            />
            {post?.comments?.length > 0 && (
              <span
                data-testid="post-comment-count"
                className="text-sm">{post?.comments.length}</span>
            )}
          </div>
          {session?.user?.id === post?.authorID && (
            <TrashIcon
              data-testid="post-delete-button"
              onClick={deletePostFunc}
              className="h-9 w-9 hoverEffect !min-h-0 !min-w-0 p-2 hover:text-red-600 hover:bg-red-100"
            />
          )}
          <div className="flex items-center">
            {hasLiked ? (
              <HeartIconFilled
                data-testid="post-like-button-filled"
                onClick={likePostFunc}
                className="h-9 w-9 hoverEffect !min-h-0 !min-w-0 p-2 text-red-600 hover:bg-red-100"
              />
            ) : (
                <HeartIcon
                  data-testid="post-like-button"
                onClick={likePostFunc}
                className="h-9 w-9 hoverEffect !min-h-0 !min-w-0 p-2 hover:text-red-600 hover:bg-red-100"
              />
            )}
            {
              // logic for likes count with optimistic update (client side)
              post?.likes?.length > 0 && (
                <span
                  className={`${
                    hasLiked && "text-red-600"
                  } text-sm select-none`}
                >
                  {" "}
                  {post?.likes?.length}
                </span>
              )
            }
          </div>

          <ShareIcon className="h-9 w-9 hoverEffect !min-h-0 !min-w-0 p-2 hover:text-sky-500 hover:bg-sky-100" />
          <ChartBarIcon className="h-9 w-9 hoverEffect !min-h-0 !min-w-0 p-2 hover:text-sky-500 hover:bg-sky-100" />
        </div>
      </div>
    </div>
  );
}
