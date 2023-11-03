"use client";

import NavbarItems from "@/components/NavbarItems";
import {
  ArrowLeftIcon,
  InboxIcon,
  SparklesIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SidebarMenu from "./SidebarMenu";
import Spinner from "./Spinner";

export default function Navbar({ title }) {
  const router = useRouter();
  const path = usePathname();
  const [username, setUsername] = useState<string>("") as any;
  const [isLoaded, setIsLoaded] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false); // this is for the responsive navbar
  const { status, data: Session } = useSession();

  useEffect(() => {
    if (navbarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [navbarOpen]);

  useEffect(() => {
    if (status === "authenticated") {
      setUsername(Session?.user?.email.split("@")[0]);
      setIsLoaded(true);
    }
  }, [Session, status]);

  // close navbar if screen is resized
  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth > 640) {
        setNavbarOpen(false);
      }
    });
  }, []);

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  return (
    <>
      <div className="top-0 sticky z-30 bg-[#ffffffd9] dark:bg-[#000000a6]">
        <div className="flex py-2 px-3 bg-transparent  border-b border-lightBorderColor dark:border-darkBorderColor backdrop-blur-md">
          {" "}
          {/* Profile photo */}
          {isLoaded && path == "/" && (
            <div
              className="sm:hidden flex items-center cursor-pointer justify-center"
              onClick={toggleNavbar}
            >
              <Image
                src={Session?.user?.image as string}
                width={40}
                height={40}
                alt=""
                className="rounded-full max-w-[32px] max-h-[32px]"
              />
            </div>
          )}
          {title ? (
            <div className="flex  items-center justify-center">
              <div className="hoverEffect !min-h-0 !min-w-0" onClick={() => router.back()}>
                <ArrowLeftIcon className="h-5 dark:text-darkText" />
              </div>
              <h2 className="text-lg sm:text-xl dark:text-darkText mx-2 font-bold cursor-pointer">
                {title}
              </h2>
            </div>
          ) : (
            <NavbarItems />
          )}
          {!title && (
            <h1 className="md:hidden dark:text-darkText text-lg sm:text-xl flex self-center justify-center w-full font-extrabold">
              ArtSphere
            </h1>
          )}
        </div>
      </div>
      {navbarOpen && path == "/" && (
        <div
          className="fixed cursor-auto inset-0 z-[9999] bg-black bg-opacity-40"
          onClick={toggleNavbar}
        >
          <div
            className="flex flex-col absolute overflow-scroll shadow-lg  bg-white dark:bg-darkBg max-w-[70%] min-w-[280px] min-h-screen top-0 z-50 items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {isLoaded ? (
              <div className="flex flex-col w-full justify-start p-4">
                <Image
                  src={Session?.user?.image as string}
                  width={40}
                  height={40}
                  alt=""
                  className="rounded-full"
                />
                <h1 className="text-lg flex font-bold cursor-pointer">
                  {Session?.user?.name}
                </h1>

                <p className="text-gray-500">
                  @{Session?.user?.email.split("@")[0]}
                </p>

                <div className="followContainer flex flex-row flex-wrap items-center w-full">
                  <div className="flex justify-center mr-5 whitespace-pre-wrap items-center">
                    <span className="text-base font-bold">157 </span>
                    <span className="text-gray-500 text-base">Following</span>
                  </div>
                  <div className="flex justify-center items-center whitespace-pre-wrap">
                    <span className="text-base font-bold">295k </span>
                    <span className="text-gray-500 text-base">Followers</span>
                  </div>
                </div>

                <div className="menuContainer">
                  <SidebarMenu toggleNavbar={toggleNavbar} username={username} nav={"true"} />
                </div>
              </div>
            ) : (
              <Spinner />
            )}
          </div>
        </div>
      )}
    </>
  );
}
