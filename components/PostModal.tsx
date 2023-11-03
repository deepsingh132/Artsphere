"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { postModalState } from "@/app/atom/modalAtom";
import { useRecoilState } from "recoil";
import { Modal } from "./modal";
import Input from "./Input";

export default function PostModal({ type, updatePosts }) {
  const [open, setOpen] = useRecoilState(postModalState);

  return (
    <div>
      {open && (
        <Modal closeModal={() => setOpen(false)}>
          <div className="max-w-[512px] sm:min-w-[400px]">
            <div className="modalHeader p-2">
            <span className="text-2xl font-bold">
                {type && "Express yourself"}
              </span>
            </div>
            <div className="p-2">
              <span
                onClick={() => setOpen(false)}
                className="absolute top-0 right-0 hoverEffect !min-h-0 !min-w-0 cursor-pointer h-fit w-fit  flex items-center justify-center"
              >
                <XMarkIcon className="h-[20px] w-[20px] text-black dark:text-white " />
              </span>
            </div>

            {type && (
              <div className="flex p-2 flex-col items-start justify-center">
              <Input
                text={""}
                setCommentModalState={setOpen}
                updatePosts={updatePosts}
                style={
                  "flex w-full min-h-[50px] sm:max-h-full text-[15px] dark:bg-darkBg dark:text-darkText"
                }
                phoneInputModal={undefined}
                id={undefined}
                />
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
