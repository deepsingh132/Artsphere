import Image from "next/image";
import Moment from "react-moment";

export default function ChatLayout({ userImg, username, msg, timestamp }) {
  return (
    <div className="flex cursor-pointer hover:bg-gray-200 dark:hover-bg-darkHover hover:opacity-90 md:max-w-lg h-max p-4 border-b border-gray-300">
      <div className="flex w-fit">
        <div className="flex pfpLayout mx-2 w-[50px] h-[50px]">
          <Image
            width="50"
            height="50"
            alt="profile picture"
            loader={({ src }) => src}
            src={userImg}
            className="rounded-full"
          />
        </div>
      </div>
      <div className="flex mx-2 w-full truncate flex-col justify-between items-start">
        <div className="flex w-full flex-row justify-start items-center">
          <p className="text-text text-lg font-bold">{username}</p>
          <div className="flex w-full flex-row justify-end items-center">
            <p className="text-text text-sm font-bold mx-1">
              <Moment fromNow>{timestamp}</Moment>
            </p>
          </div>
        </div>
        <div className="flex flex-row justify-start items-center">
          <p
            className="text-text text-base truncate"
            style={{
              maxWidth: "100%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {msg}
          </p>
        </div>
      </div>
    </div>
  );
}
