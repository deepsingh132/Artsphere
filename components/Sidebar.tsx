"use client";

import Image from "next/image";
import SidebarMenu from "./SidebarMenu";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { postModalState } from "@/app/atom/modalAtom";

export default function Sidebar({}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useRecoilState(postModalState);
  const [currentUser, setCurrentUser] = useState(null) as any;
  const { status, data: session } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      setCurrentUser(session?.user);
    } else {
      setCurrentUser(null);
    }
  }, [session?.user, status]);

  return (
    <div className="hidden bg-white dark:bg-darkBg z-40 sm:flex sm:self-start overflow-y-auto flex-col p-2 xl:items-start fixed h-full xl:ml-20">
      <div
        onClick={() => router.push("/")}
        className="hoverEffect flex justify-center content-center align-middle p-2 hover:bg-orange-100 xl:px-2"
      >
        <Image
          width={50}
          alt="logo"
          height={50}
          className="rounded-full"
          src="https://img.logoipsum.com/226.svg"
        ></Image>

        <h1 className="hidden xl:flex dark:text-darkText self-center text-2xl font-extrabold ml-2">
          ArtSphere
        </h1>
      </div>

      {/* Menu */}

      <div className="mt-4 mb-2.5 xl:items-start">
        <SidebarMenu username={session?.user?.email?.split("@")[0]} nav={undefined} toggleNavbar={undefined} />
        {/* <SidebarMenuItem text="More" Icon={EllipsisHorizontalCircleIcon} /> */}
        {/* </>
        )} */}
      </div>

      {/* Button */}

      {currentUser ? (
        <>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-primary text-text  rounded-full w-56 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline">
            Express
          </button>
          <div className="hoverEffect text-gray-700 flex items-center justify-center xl:justify-start my-auto">
            <Image
              width="50"
              height="50"
              src={currentUser?.image}
              alt="user-img"
              className="h-10 w-10 rounded-full xl:mr-2"
            />
            <div className="leading-5 hidden xl:inline">
              <h4 className="font-bold dark:text-darkText">{currentUser?.name}</h4>
              <p className="text-gray-500">
                @{currentUser.email.split("@")[0]}
              </p>
            </div>
          </div>
        </>
      ) : null}

      {!currentUser ? (
        <button
          onClick={() => router.push("/login")}
          className="bg-primary text-text  rounded-full w-36 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline"
        >
          Sign in
        </button>
      ) : (
        <button
          onClick={() => signOut()}
          className="bg-primary text-text  mb-4 rounded-full w-36 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline"
        >
          Sign out
        </button>
      )}
    </div>
  );
}
