import {
  BellIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  UserIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/solid";
import { useRouter, usePathname } from "next/navigation";
import { Modal } from "./modal";
import { useEffect, useState } from "react";
import ModeToggle from "./ModeToggle";

export default function SidebarMenu({username, nav, toggleNavbar}) {

  const router = useRouter();
  const currentRoute = usePathname();
  const [modalOpen, setModalOpen] = useState(false);
  const isActive = (route: string) => route === currentRoute;

   useEffect(() => {
     // Set the body overflow to hidden when the modal is open
     if (modalOpen) {
       document.body.style.overflow = "hidden";
     } else {
       document.body.style.overflow = "auto";
     }
   }, [modalOpen]);

  const handleMenuItemClick = (to: string) => {

    if (to == "/settings") {
      setModalOpen(true);
      return;
    }
    if (currentRoute == to) {
      router.refresh();
    }
    if (to == "/") {
      router.replace("/");
      return;
    }
    if (toggleNavbar && to == "/") {
      toggleNavbar();
    }
    router.push(to);
  };

  function closeModal() {
    setModalOpen(false);
  }

  return (
    <div className="flex flex-col h-fit justify-evenly">
      <div
        className="hoverEffect flex items-center text-gray-700 dark:text-darkText justify-center xl:justify-start text-lg mt-5 space-x-3"
        onClick={() => handleMenuItemClick("/")}
      >
        <HomeIcon className="h-7" />
        <span
          className={`${isActive("/") && "font-bold"}  ${
            nav ? "" : "hidden xl:inline"
          }`}
        >
          Home
        </span>
      </div>

      <div
        className="hoverEffect flex items-center text-gray-700 dark:text-darkText justify-center xl:justify-start text-lg mt-5 space-x-3"
        onClick={() => handleMenuItemClick("/for-you")}
      >
        <SparklesIcon className="h-7" />
        <span
          className={`${isActive("/for-you") && "font-bold"}  ${
            nav ? "" : "hidden xl:inline"
          }`}
        >
          For You
        </span>
      </div>

      <div
        className="hoverEffect flex items-center text-gray-700 dark:text-darkText justify-center xl:justify-start text-lg mt-5 space-x-3"
        onClick={() => handleMenuItemClick("/events")}
      >
        <MagnifyingGlassIcon className="h-7" />
        <span
          className={`${isActive("/events") && "font-bold"}  ${
            nav ? "" : "hidden xl:inline"
          }`}
        >
          Events
        </span>
      </div>

      <div
        className="hoverEffect flex items-center text-gray-700 dark:text-darkText justify-center xl:justify-start text-lg mt-5 space-x-3"
        onClick={() => handleMenuItemClick("/notifications")}
      >
        <BellIcon className="h-7" />
        <span
          className={`${isActive("/notifications") && "font-bold"}  ${
            nav ? "" : "hidden xl:inline"
          }`}
        >
          Notifications
        </span>
      </div>

      <div
        className="hoverEffect flex items-center text-gray-700 dark:text-darkText justify-center xl:justify-start text-lg mt-5 space-x-3"
        onClick={() => handleMenuItemClick("/chat")}
      >
        <InboxIcon className="h-7" />
        <span
          className={`${isActive("/chat") && "font-bold"}  ${
            nav ? "" : "hidden xl:inline"
          }`}
        >
          Messages
        </span>
      </div>

      {username ? (
        <div
          className="hoverEffect flex items-center text-gray-700 dark:text-darkText justify-center xl:justify-start text-lg mt-5 space-x-3"
          onClick={() => handleMenuItemClick(`/${username}`)}
        >
          <UserIcon className="h-7" />
          <span
            className={`${isActive("/profile") && "font-bold"}  ${
              nav ? "" : "hidden xl:inline"
            }`}
          >
            Profile
          </span>
        </div>
      ) : (
        <div
          className="hoverEffect flex items-center text-gray-700 dark:text-darkText justify-center xl:justify-start text-lg mt-5 space-x-3"
          onClick={() => handleMenuItemClick("/login")}
        >
          <UserIcon className="h-7" />
          <span
            className={`${isActive("/login") && "font-bold"}  ${
              nav ? "" : "hidden xl:inline"
            }`}
          >
            Profile
          </span>
        </div>
      )}

      <div
        className="hoverEffect flex items-center text-gray-700 dark:text-darkText justify-center xl:justify-start text-lg mt-5 space-x-3"
        onClick={() => handleMenuItemClick("/settings")}
      >
        <Cog6ToothIcon className="h-7" />
        <span
          className={`${isActive("/settings") && "font-bold"}  ${
            nav ? "" : "hidden xl:inline"
          }`}
        >
          Settings
        </span>
      </div>

      {modalOpen && (
        <Modal closeModal={closeModal}>
          <div
            role="settings-modal"
            className="contentContainer overflow-hidden mx-auto flex flex-col justify-between items-center w-[80vw] md:w-[440px] h-full">
            <h1 className="text-2xl dark:text-white font-bold">Settings</h1>
            <div className="settingsItem flex p-2 w-full mx-auto justify-between">
              <div className="flex mx-auto">
                <p className="text-gray-700 dark:text-gray-50 py-5">
                  Dark Mode
                </p>
              </div>
              <div className="flex mx-auto">
                <ModeToggle />
              </div>
            </div>
            <div className="doneButton flex justify-center w-full">
              <button
                data-testid="done-button"
                className="bg-primary min-w-[36px] min-h-[36px] hover:opacity-70 text-text font-bold  px-4 rounded-full"
                onClick={closeModal}
              >
                Done
              </button>
              </div>
          </div>
        </Modal>
      )}

      {/* <div
        className="hoverEffect flex items-center text-gray-700 justify-center xl:justify-start text-lg mt-7 space-x-3"
        onClick={handleMenuItemClick}
      >
        <EllipsisHorizontalCircleIcon className="h-7" />
        <span className={`${active && "font-bold"} hidden xl:inline`}>
          More
        </span>
      </div> */}
    </div>
  );
}
