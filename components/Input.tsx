"use client";

import {
  FaceSmileIcon,
  PaperClipIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useSession } from "next-auth/react";
import YoutubeEmbed from "./YoutubeEmbed";
import { Modal } from "./modal";
import Spinner from "./Spinner";
import { toastError, toastSuccess } from "./Toast";
import toast from "react-hot-toast";
import ObjectId from "@/app/utils/ObjectId";
import { addComment, addPost } from "@/app/utils/postUtils";

export default function Input({
  text,
  id,
  updatePosts,
  style,
  phoneInputModal,
  setCommentModalState,
}) {
  const [input, setInput] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState<string>("");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef<any>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const maxCharacters = 300;
  const { status, data: session } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      setCurrentUser(session.user);
    } else {
      setCurrentUser(null);
    }
  }, [status, session]);

  // clear the span input when input is empty
  useEffect(() => {
    if (
      input.length === 0 &&
      document?.getElementById("contentEditableInput")
    ) {
      document.getElementById("contentEditableInput")!.innerText = "";
    }
  }, [input]);

  useEffect(() => {
    // Set the body overflow to hidden when the modal is open
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modalOpen]);

  if (status === "loading") {
    // a skeleton loader
    return (
      <>
        <div className="border-b border-gray-300 shadow h-auto p-4 space-x-3">
          <div className="animate-pulse h-full w-full flex space-x-4">
            <div className="flex h-full self-start justify-start items-start">
              <div className="flex justify-start rounded-full bg-slate-700 h-11 w-11"></div>
            </div>

            <div className="flex-1 space-y-6 py-1">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-700 max-w-[200px] rounded col-span-1"></div>
                  <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  function handleEventClick() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  const sanitize = (str: string) => {
    return str?.replace(/</g, "&lt;").replace(/>/g, "&gt;").slice(0, 300);
  };

  function addYoutubeVideo(url: string) {
    const videoId = url.split("v=")[1];
    // if the url is not a valid youtube url
    const validFormats = [
      "https://www.youtube.com/watch?v=",
      "https://youtu.be/watch?v=",
    ];
    if (url?.length === 0 || !validFormats.includes(url.split(videoId)[0])) {
      setYoutubeVideoUrl("");
      alert("Please enter a valid youtube url!");
      return;
    }

    confirm("Are you sure you want to add this yt video to the post?") &&
      setMediaUrl(`https://www.youtube.com/watch?v=${videoId}`);
    closeModal();
  }

  async function addMediaToPost(e: { target: { files: any[] } }) {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent?.target?.result);
      uploadMedia(e.target.files[0]);
    };
  }

  function verifyFile(file: any) {
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (validTypes.indexOf(file.type) === -1) {
      setSelectedFile(null);
      setMediaUrl("");
      alert("File type not supported!");
      return false;
    }
    return true;
  }

  const uploadMedia = async (file: any) => {
    if (!file) {
      alert("Please select a file!");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setSelectedFile(null);
      alert("File size should be less than 4mb!");
      return;
    }

    if (!verifyFile(file)) {
      return;
    }

    const formData = new FormData() as any;
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );
    try {
      setLoading(true);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      toast.success("Image uploaded!", undefined);
      setMediaUrl(res.data.secure_url);
      setLoading(false);
      return res.data.secure_url;
    } catch (error) {
      toastError("Error uploading image", undefined);
      setLoading(false);
      return null;
    }
  };

  async function sendReply(e: { preventDefault: () => void }) {
    e.preventDefault();
    setLoading(true);
    if (
      !input.trim() &&
      !mediaUrl?.trim() &&
      selectedFile === null &&
      selectedFile instanceof File === false
    ) {
      alert("Please enter some text!");
      return;
    }
    const sanitizedInput = sanitize(input?.trim());
    const sanitizedUrl = sanitize(mediaUrl?.trim());

    const reply = {
      _id: ObjectId(),
      userId: session?.user?.id,
      content: sanitizedInput || "",
      username: session?.user?.email.split("@")[0],
      timestamp: Date.now(),
      userImg: session?.user?.image,
      name: session?.user?.name,
      category: "other",
      url: sanitizedUrl || "",
    };

    // early return if the post is empty
    if (reply.content?.trim().length === 0 && reply.url?.trim().length === 0) {
      setLoading(false);
      return;
    }

    // if updatePosts is not null, then the post was sent from the home page
    if (updatePosts) {
      updatePosts("reply", reply, id);
    }

    const res = await addComment(reply, session?.user?.accessToken, id);
    if (res) {
      toastSuccess("Comment added!", undefined);
    } else {
      // TODO: add rollback optimistic update for replies
      toastError("Error adding reply!", undefined);
    }
    setLoading(false);

    if (phoneInputModal) {
      phoneInputModal(false);
    }

    if (setCommentModalState) {
      setCommentModalState(false);
    }

    setLoading(false);
    setInput("");
    setMediaUrl("");
  }

  async function sendPost(e: { preventDefault: () => void }) {
    e.preventDefault();
    setLoading(true);
    if (
      !input.trim() &&
      !mediaUrl?.trim() &&
      selectedFile === null &&
      selectedFile instanceof File === false
    ) {
      alert("Please enter some text!");
      return;
    }

    const sanitizedInput = sanitize(input?.trim());
    const sanitizedUrl = sanitize(mediaUrl?.trim());

    const post = {
      _id: ObjectId(),
      username: session?.user?.email.split("@")[0] || "test",
      userImg: session?.user?.image || "",
      content: sanitizedInput || "",
      category: "other",
      url: sanitizedUrl || "",
      name: session?.user?.name || "Test User",
      authorID: session?.user?.id,
    } as Post;

    // early return if the post is empty
    if (post.content?.trim().length === 0 && post.url?.trim().length === 0) {
      setLoading(false);
      return;
    }

    // if updatePosts is not null, then the post was sent from the home page
    if (updatePosts) {
      updatePosts("add", post, undefined);
    }

    const res = await addPost(post, session?.user?.accessToken);
    if (res) {
      toastSuccess("Post sent!", undefined);
    } else {
      // rollback optimistic update
      updatePosts("delete", null, post._id);
      toastError("Error sending post", undefined);
    }
    setLoading(false);

    if (phoneInputModal) {
      phoneInputModal(false);
    }

    if (setCommentModalState) {
      setCommentModalState(false);
    }

    setInput("");
    setMediaUrl("");
    setSelectedFile(null);
  }

  function handleInput(e: { target: { innerText: string } }) {
    const text = e.target.innerText;

    // If the content is empty or only contains line breaks, show the placeholder
    if (text.trim().length === 0 || text === "\n") {
      e.target.innerText = "";
    }

    if (text.length <= maxCharacters) {
      setInput(text);
    } else {
      alert("You have exceeded the character limit!");
      // Truncate the text if it exceeds the character limit
      e.target.innerText = text.substring(0, maxCharacters);
    }
  }

  function clearAllMedia() {
    setSelectedFile(null);
    setMediaUrl("");
  }

  return (
    <>
      <div
        data-testid="input"
        className={style ? style : "hidden sm:block z-0 lg:max-w-[700px]"}
      >
        {currentUser && (
          <div
            data-testid="input-container"
            className={
              style
                ? style
                : "flex border-b z-0 border-lightBorderColor dark:border-darkBorderColor p-4 space-x-3"
            }
          >
            <Image
              data-testid="input-user-avatar"
              src={session?.user?.image as string}
              alt="user-img"
              width={40}
              height={40}
              style={
                setCommentModalState || phoneInputModal
                  ? { marginRight: "12px" }
                  : {}
              }
              className="h-11 w-11 rounded-full cursor-pointer hover:brightness-95"
            />
            <div
              className={`${
                setCommentModalState || phoneInputModal
                  ? "flex flex-1 flex-col max-h-[calc(90vw - 200px)] pr-3 sm:pr-0 !ml-0 focus-within:divide-y dark:divide-gray-500 divide-gray-200 max-w-[calc(80vw-80px)]"
                  : "flex flex-col w-full max-w-xl lg:max-w-[700px] md:max-w-screen ml-4 focus-within:divide-y dark:divide-gray-500 divide-gray-200 "
              }`}
            >
              <div
                className={`flex md:max-w-full z-0 dark:bg-darkBg ml-2 ${
                  !setCommentModalState ? "" : ""
                } divide-y divide-gray-200 `}
              >
                <span
                  data-testid="input-custom-inputField"
                  className={`${
                    setCommentModalState || phoneInputModal
                      ? "sm:max-w-[400px] max-w-[calc(70vw)]"
                      : "max-w-[550px]"
                  }  flex-shrink sm:min-h-[24px] ${
                    style ? "max-h-[70vh]" : "max-h-[720px]"
                  } !p-0 border-none dark:bg-darkBg dark:text-darkText cursor-text focus:ring-0 text-sm sm:text-lg placeholder-gray-700 tracking-wide break-words  text-gray-700`}
                  id="contentEditableInput"
                  inputMode="text"
                  role="textbox"
                  onInput={handleInput as any}
                  placeholder={text ? text : "What's on your mind?"}
                  contentEditable="true"
                  style={{
                    resize: "none",
                    overflow: "hidden",
                    display: "block",
                    padding: "0px",
                    borderBottom: "none",
                    boxShadow: "none",
                    textDecoration: "none",
                    textDecorationLine: "none",
                    outline: "none",
                  }}
                  onChange={(e) =>
                    setInput((e.target as HTMLInputElement)?.value)
                  }
                ></span>
              </div>
              {(selectedFile || mediaUrl?.includes("youtube")) && (
                <div className="relative  py-2">
                  <div className="flex hoverEffect p-4 h-fit w-fit items-center justify-center !min-h-0 !min-w-0">
                    <XMarkIcon
                      onClick={() =>
                        confirm("Are you sure you want to remove the media?") &&
                        clearAllMedia()
                      }
                      className="dark:border h-7 w-7 text-black absolute dark:text-white cursor-pointer border-white rounded-full"
                    />
                  </div>
                  {selectedFile ? (
                    <Image
                      height={1000}
                      width={1000}
                      alt="media"
                      src={selectedFile}
                      className={`${loading && "animate-pulse"} ${
                        style && mediaUrl ? "" : ""
                      } object-cover z-50 w-full max-h-[300px] sm:max-h-none sm:h-[300px] rounded-xl cursor-pointer`}
                    />
                  ) : (
                    <div
                      className={` ${
                        style && mediaUrl ? "" : "flex"
                      } mt-0 w-full h-full max-w-[80vw]`}
                    >
                      <YoutubeEmbed embedId={mediaUrl?.split("v=")[1]} />
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between w-full pt-2.5">
                {/* {!loading && ( */}
                <>
                  <div className="flex">
                    {!mediaUrl?.trim() && (
                      <div
                        data-testid="input-photo-icon"
                        className=""
                        onClick={() => filePickerRef.current?.click() as any}
                      >
                        <PhotoIcon
                          title="Add photo"
                          style={
                            loading ? { display: "none" } : { display: "block" }
                          }
                          className="h-10 w-10 hoverEffect !min-h-0 !min-w-0 p-2 text-primary hover:bg-orange-100"
                        />
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          ref={filePickerRef}
                          onChange={addMediaToPost as any}
                        />
                      </div>
                    )}
                    <FaceSmileIcon
                      title="Add emoji"
                      style={
                        loading ? { display: "none" } : { display: "block" }
                      }
                      className="h-10 w-10 hoverEffect !min-h-0 !min-w-0 p-2 text-primary hover:bg-orange-100"
                    />
                    <PaperClipIcon
                      onClick={handleEventClick}
                      title="Add media"
                      style={
                        loading || selectedFile
                          ? { display: "none" }
                          : { display: "block" }
                      }
                      className="h-10 w-10 hoverEffect !min-h-0 !min-w-0 p-2 text-primary hover:bg-orange-100"
                    />
                  </div>
                  {loading ? (
                    <div className="flex">
                      <Spinner />
                    </div>
                  ) : (
                      <button
                        data-testid="input-post-button"
                      onClick={id ? sendReply : sendPost}
                      disabled={
                        (!input.trim() &&
                          !mediaUrl?.trim() &&
                          selectedFile === null &&
                          selectedFile instanceof File === false) ||
                        loading
                      }
                      className={`bg-primary ${
                        loading ? "hidden" : "block"
                      } text-text px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50`}
                    >
                      {id ? "Reply" : "Post"}
                    </button>
                  )}
                </>
                {/* )} */}
              </div>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <Modal closeModal={closeModal}>
          <div className="contentContainer dark:text-darkText overflow-hidden mx-auto flex flex-col justify-between items-center w-[80vw] md:w-[440px] h-full">
            <div className="titleContainer flex flex-row">
              <h1 className="md:text-2xl text-xl font-bold">Add media</h1>
            </div>
            <div className="bodyContainer mt-6 flex flex-col justify-start items-start w-full h-max">
              <p className="text-sm font-semibold">
                Add video or audio link from YouTube{" "}
              </p>
              <input
                className="text-black dark:text-darkText dark:bg-darkCard  shadow-sm hover:shadow-md focus:ring-0 w-full focus:border-primary focus-within:shadow-lg md:min-w-[60px] p-2 bg-gray-100 focus-within:bg-white  text-sm font-normal rounded-full transition duration-300 ease-in-out"
                placeholder="Enter url of the media"
                value={youtubeVideoUrl}
                onChange={(e) => setYoutubeVideoUrl(e.target.value)}
              />
              <button
                className="text-text self-center mt-4 shadow-md hover:bg-hoverColor disabled:opacity-50 md:min-w-[60px] p-2 bg-primary text-sm font-bold rounded-full transition duration-500 ease-in-out "
                onClick={() =>
                  youtubeVideoUrl?.length > 0
                    ? addYoutubeVideo(youtubeVideoUrl)
                    : alert("Please enter a url!")
                }
              >
                Add Media
              </button>
              <div className="previewContainer flex flex-col justify-start items-start w-full h-max mt-4">
                <p className="text-sm font-semibold">Preview</p>
                <div className="preview flex flex-row justify-start items-start w-full h-max mt-2">
                  <YoutubeEmbed embedId={youtubeVideoUrl?.split("v=")[1]} />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
