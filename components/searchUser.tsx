"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { backendUrl } from "@/app/utils/config/backendUrl";
import axios from "axios";
import { Session } from "next-auth/core/types";

export default function SearchUser({ user, currentUser }: { user: User; currentUser: Session | null }) {
  const [isFollowing, setIsFollowing] = useState(null) as any;
  const router = useRouter();

  useEffect(() => {
    if (currentUser && user.followers && user.followers?.length > 0) {
      setIsFollowing(user.followers.includes(currentUser?.user.id));
    }
  }, [currentUser, user.followers]);

  async function followUser() {
    if (!currentUser) {
      alert("You must be logged in to follow a user!");
      return;
    }

    if (currentUser?.user?.id === user?._id) {
      alert("You cannot follow yourself!");
      return;
    }

    setIsFollowing(!isFollowing); // optimistic updates
    if (!isFollowing) {
      user?.followers?.push(currentUser?.user?.id);
    }
    if (isFollowing) {
      const index = user?.followers?.indexOf(currentUser?.user?.id);
      if (index && index > -1) {
        user?.followers?.splice(index, 1);
      }
    }

    const res = await axios.put(
      `${backendUrl}/user/${user.username}/follow`,
      {
        action: "follow",
        userId: currentUser?.user?.id,
        followFrom: currentUser?.user?.id,
        followTo: user?._id,
      },
      {
        headers: {
          Authorization: `Bearer ${currentUser?.user?.accessToken}`,
        },
      }
    );
    // roleback all optimistic updates if error
    if (res.status !== 200 && isFollowing) {
      setIsFollowing(!isFollowing);
      user?.followers?.push(currentUser?.user?.id);
    }
    if (res.status !== 200 && !isFollowing) {
      setIsFollowing(!isFollowing);
      const index = user?.followers?.indexOf(currentUser.user.id);
      if (index && index > -1) {
        user?.followers?.splice(index, 1);
      }
    }
  }

  return (
    <div
      key={user._id}
      className="flex py-3 px-4 cursor-pointer justify-between transition ease-in duration-200 w-full hover:bg-gray-100 dark:hover:bg-darkHover"
    >
      <Image
        src={user.image || "/default-user-img.jpg"}
        referrerPolicy="no-referrer"
        alt={user.name}
        width={40}
        height={40}
        onClick={() => router.push(`/${user.username}`)}
        className="rounded-full h-10 w-10 mr-2 object-cover"
      />
      <div
        onClick={() => router.push(`/${user.username}`)}
        className="flex flex-col max-w-[300px] whitespace-nowrap truncate  ml-2"
      >
        <span className="text-black  font-semibold dark:text-darkText md:text-lg">
          {user.name}
        </span>
        <span className=" text-gray-500 font-normal md:text-base">
          @{user.username}
        </span>
      </div>
      <div className="flex flex-col ml-auto">
        {currentUser?.user?.id !== user._id && (
          <>
            {isFollowing !== null && isFollowing ? (
              <button
                onClick={followUser}
                onMouseOver={(e): void => {
                  e.currentTarget.textContent = "Unfollow";
                }}
                onMouseLeave={(e): void => {
                  e.currentTarget.textContent = "Following";
                }}
                className=" dark:text-darkText w-auto min-w-[80px] hover:text-[rgb(244,33,46)] dark:hover:text-[rgb(244,33,46)] hover:bg-[rgba(244,33,46,0.1)] hover:border-[rgb(103,7,15)] border border-[rgb(83,100,113)] ml-auto rounded-full text-sm px-3.5 py-1.5 font-bold"
              >
                Following
              </button>
            ) : (
              <button
                onClick={followUser}
                className="ml-auto bg-black hover:brightness-90 dark:bg-white dark:text-gray-950 text-white rounded-full text-sm px-3.5 py-1.5 font-bold"
              >
                Follow
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
