"use client";
import {
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { modalState, postIdState } from "@/app/atom/modalAtom";

import Moment from "react-moment";
import { useRecoilState } from "recoil";
import Image from "next/image";
import axios from "axios";
import YoutubeEmbed from "./YoutubeEmbed";
import { Modal } from "./modal";
import Spinner from "./Spinner";
import Input from "./Input";
import { toastError } from "./Toast";
import { backendUrl } from "@/app/utils/config/backendUrl";

export default function CommentModal({type, updatePosts}) {
  const [open, setOpen] = useRecoilState(modalState);
  const [post, setPost] = useState<Post | null>(null);
  const [postId] = useRecoilState(postIdState);

  // fetch the post
  useEffect(() => {
    async function fetchPost() {
      // resets the post state
      setPost(null);
      try {
        const res = await axios.get(
          `${backendUrl}/posts/${postId}`
        );
        setPost(res.data.post);
      } catch (error) {
        toastError("Error fetching post", undefined);
      }
    }
    if (postId !== "id") fetchPost();
  }, [open, postId]);

  return (
    <div>
      {open && (
        <Modal closeModal={() => setOpen(false)}>
          <div
            data-testid="comment-modal"
            role="dialog"
            className="max-w-[600px] overflow-y-auto"
          >
            <div className="py-3">
              <span
                onClick={() => setOpen(false)}
                className="absolute top-0 right-0 hoverEffect !min-h-0 !min-w-0 cursor-pointer h-fit w-fit  flex items-center justify-center"
              >
                <XMarkIcon className="h-[20px] w-[20px] text-black dark:text-white " />
              </span>
            </div>

            {type && !post?._id && (
              <Input
                text={""}
                setCommentModalState={setOpen}
                updatePosts={updatePosts}
                style={
                  "flex w-full min-h-[50px] max-h-[100px] text-[15px] dark:bg-darkBg dark:text-darkText"
                }
                phoneInputModal={undefined}
                id={undefined}
              />
            )}

            {post?._id ? (
              <>
                <div
                  data-testid="comment-modal-post"
                  className="flex p-3 mt-2 justify-start space-x-3 relative"
                >
                  <div className="flex">
                    <span className="w-0.5 h-[calc(100%-60px)] mt-4 z-0 absolute left-8 top-11 bg-gray-300 dark:bg-darkBorderColor " />
                    <Image
                      height={40}
                      width={40}
                      referrerPolicy="no-referrer"
                      className="h-11 z-20 w-11 rounded-full mr-3"
                      src={post?.userImg || "/default-user-img.jpg"}
                      alt="post-img"
                    />
                    <div className="flex-1 max-h-[calc(90vw - 200px)] pr-3 sm:pr-0 max-w-[calc(80vw-80px)]">
                      <div className="flex flex-shrink text-clip justify-between items-center break-words overflow-hidden whitespace-nowrap space-x-1 ">
                        <h4 className="font-bold text-[15px] overflow-hidden text-clip max-w-[300px]  sm:text-[16px] dark:text-darkText">
                          {post.name}
                        </h4>
                        <span className="text-sm sm:text-[15px] hover:underline dark:text-gray-400">
                          @{post?.username} ·{" "}
                        </span>
                        <span className="text-sm sm:text-[15px]  text-gray-500">
                          <Moment fromNow>{post?.createdAt}</Moment>
                        </span>
                      </div>

                      <div className="flex flex-col max-h-[calc(90vw - 200px)] max-w-[calc(80vw-80px)] items-start justify-between py-2">
                        {post?.content && (
                          <p className="text-text dark:text-darkText whitespace-normal break-words pb-3 text-[15px] sm:text-[16px] ">
                            {post?.content}
                          </p>
                        )}

                        {post?.url && !post?.url?.includes("youtube") && (
                          <Image
                            referrerPolicy="no-referrer"
                            className="object-cover z-50 w-full max-h-[300px] sm:max-h-none sm:h-[300px] rounded-xl cursor-pointer"
                            src={post?.url}
                            alt="post-img"
                            width={1000}
                            height={1000}
                          />
                        )}

                        {post?.url && post?.url?.includes("youtube") && (
                          <div className="flex w-full sm:min-w-[300px] justify-center">
                            <YoutubeEmbed embedId={post?.url?.split("=")[1]} />
                          </div>
                        )}

                        <span className="sm:pt-3 truncate text-[15px] max-h-[calc(90vw - 200px)] max-w-[calc(80vw-80px)] leading-5 pt-2 text-gray-500">
                          Replying to{" "}
                          <span
                            title={post?.username}
                            className="text-primary truncate cursor-pointer"
                          >
                            @{post?.username}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex p-3 space-x-3 overflow-auto">
                  <div className="flex-1 ">
                    <Input
                      text={"Post your reply"}
                      id={postId}
                      setCommentModalState={setOpen}
                      updatePosts={updatePosts}
                      style={
                        "flex w-full min-h-[50px] text-[15px] z-0 dark:bg-darkBg dark:text-darkText"
                      }
                      phoneInputModal={undefined}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex w-[200px] justify-center items-center h-[200px]">
                <div className="text-gray-500 text-[15px] sm:text-[16px]">
                  <Spinner />
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
