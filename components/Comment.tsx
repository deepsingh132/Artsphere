"use client";

import {
  ChartBarSquareIcon as ChartBarIcon,
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

import { useSession } from "next-auth/react";
import axios from "axios";
import Image from "next/image";
import YoutubeEmbed from "./YoutubeEmbed";
import { toastError, toastSuccess } from "./Toast";
import { backendUrl } from "@/app/utils/config/backendUrl";
import { deleteComment } from "@/app/utils/postUtils";

export default function Comment({ comment, commentId, originalPostId, updatePosts }) {
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [open, setOpen] = useState(false);
  const [postId, setPostId] = useState("");
  const [currentUser, setCurrentUser] = useState(null) as any;
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();
  const [username, setUsername] = useState("");

  const { status, data: session } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      setCurrentUser(session.user);
      setUsername(session?.user?.email?.split("@")[0] || "");
      setUserId(session?.user?.id || "");
    } else {
      setCurrentUser(null);
    }
  }, [session?.user, status]);

  useEffect(() => {
    setLikes(comment?.likes);
  }, [comment]);


  const likeComment = async () => {

    setHasLiked(!hasLiked); //optimistic update

    const res = await axios.put(
      `${backendUrl}/posts/${originalPostId}/like`,
      {
        userId: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }
    );

    const data = res.data;
    setLikes(data.likes);

    // rollback if error
    if (res.status !== 200) {
      setHasLiked(!hasLiked);
    }

  };

  const deleteCommentFunc = async () => {
    updatePosts("delete", null, commentId); // optimistic update
    const res = await deleteComment(commentId, session?.user?.accessToken);
    if (!res) {
      toastError("Error deleting comment", undefined);
      updatePosts("add", comment, commentId); // rollback
    } else {
      toastSuccess("Comment deleted", undefined);
    }
  };


  return (
    <div className="flex py-3 hover:bg-gray-50 dark:hover:bg-darkHover transition-colors ease-in duration-300 w-full max-w-[] sm:px-5 px-4 cursor-pointer border-b border-lightBorderColor dark:border-darkBorderColor">
      {/* user image */}
      <Image
        height={40}
        width={40}
        className="h-11 w-11 rounded-full mr-4"
        src={comment?.userImg}
        alt="user-img"
      />
      {/* right side */}
      <div className="flex-1 truncate">
        {/* Header */}

        <div className="flex items-start justify-between truncate">
          {/* post user info */}
          <div className="flex items-center truncate space-x-1 whitespace-nowrap dark:text-gray-500">
            <h4
              onClick={() => router.push(`/${comment?.username}`)}
              className="font-bold text-sm sm:text-base hover:underline dark:text-darkText"
            >
              {comment?.name}
            </h4>
            <span
              onClick={() => router.push(`/${comment?.username}`)}
              className="text-sm sm:text-[15px]"
            >
              @{comment?.username} ·{" "}
            </span>
            <span className="text-sm sm:text-[15px] truncate hover:underline">
              <Moment fromNow>
                {comment?.timestamp
                  ? new Date(parseInt(comment?.timestamp, 10))
                  : undefined}
              </Moment>
            </span>
          </div>

          {/* dot icon */}
          <DotsHorizontalIcon className=" h-9 !min-h-0 !min-w-0 hoverEffect hover:bg-sky-100 hover:text-sky-500 p-2 dark:text-gray-500" />
        </div>

        {/* post text */}

        <p className="text-gray-800 dark:text-darkText text-[15px] sm:text-[16px] mb-2">
          {comment?.content}
        </p>

        {comment?.url && !comment?.url?.includes("youtube") && (
          <Image
            className="rounded-2xl max-h-80 w-[100%] sm:w-full object-cover"
            width={500}
            height={500}
            src={comment?.url}
            alt="img"
          />
        )}

        {comment?.url && comment?.url?.includes("youtube") && (
          <YoutubeEmbed embedId={comment?.url?.split("v=")[1]} />
        )}

        {/* icons */}

        <div className="flex justify-between text-gray-500 sm:p-2 ml-[-8px]">
          <div className="flex items-center select-none">
            <ChatIcon
              onClick={() => {
                if (!currentUser) {
                  router.push("/login");
                } else {
                  setPostId(originalPostId);
                  setOpen(!open);
                }
              }}
              className="h-9 w-9 !min-h-0 !min-w-0 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100"
            />
          </div>
          {session?.user?.id === comment?.userId && (
            <TrashIcon
              onClick={deleteCommentFunc}
              className="h-9 w-9 !min-h-0 !min-w-0 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
            />
          )}
          <div className="flex items-center">
            {hasLiked ? (
              <HeartIconFilled
                onClick={likeComment}
                className="h-9 w-9 !min-h-0 !min-w-0 hoverEffect p-2 text-red-600 hover:bg-red-100"
              />
            ) : (
              <HeartIcon
                onClick={likeComment}
                className="h-9 w-9 !min-h-0 !min-w-0 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
              />
            )}
            {likes?.length > 0 && (
              <span
                className={`${hasLiked && "text-red-600"} text-sm select-none`}
              >
                {" "}
                {likes?.length}
              </span>
            )}
          </div>

          <ShareIcon className="h-9 w-9 !min-h-0 !min-w-0 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
          <ChartBarIcon className="h-9 w-9 !min-h-0 !min-w-0 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
        </div>
      </div>
    </div>
  );
}
