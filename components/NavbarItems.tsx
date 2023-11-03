"use client";

import { MusicalNoteIcon } from "@heroicons/react/24/outline";
import { PaintBrushIcon } from "@heroicons/react/24/outline";
import { FilmIcon } from "@heroicons/react/24/outline";
import { BookOpenIcon } from "@heroicons/react/24/outline";

import { useRouter, usePathname } from "next/navigation";

export default function NavbarItems() {


  const router = useRouter();
  // get current page
  const path = usePathname();

  const handleMenuClick = (item) => {
    if (path !== "/") {
      router.replace(`/?feed=${item}`);
      return;
    }
    switch (item) {
      case "music":
        router.replace(`${path}?feed=music`);
        break;
      case "art":
        router.replace(`${path}?feed=art`);
        break;
      case "film":
        router.replace(`${path}?feed=film`)
        break;
      case "lit":
        router.replace(`${path}?feed=lit`)
        break;
    }
  }

  return (
    <div className="hidden w-fit md:flex align-middle flex-grow justify-center items-center">
      <ul className="hidden md:text-2xl font-semibold sm:text-l md:flex content-center align-middle justify-center w-full whitespace-nowrap md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0">
        <li className="">
          <a
            href="#"
            className="flex hoverEffect w-full justify-center items-center"
            aria-current="page"
          >
            <span className="flex" onClick={() => handleMenuClick("music")}>
              Music
              <MusicalNoteIcon className="h-6 ml-2" />
            </span>
          </a>
        </li>
        <li className="">
          <a
            href="#"
            className="flex hoverEffect ml-2 w-full justify-center items-center"
          >
            <span className="flex" onClick={() => handleMenuClick("art")}>
              Art
              <PaintBrushIcon className="h-6 ml-2" />
            </span>
          </a>
        </li>
        <li>
          <a
            href="#"
            className="flex hoverEffect ml-2 w-full justify-center items-center"
          >
            <span className="flex" onClick={() => handleMenuClick("film")}>
              Theater
              <FilmIcon className="h-6 ml-2" />
            </span>
          </a>
        </li>
        <li>
          <a
            href="#"
            className="flex hoverEffect ml-2 w-full justify-center items-center"
          >
            <span className="flex" onClick={() => handleMenuClick("lit")}>
              Literature
              <BookOpenIcon className="h-6 ml-2" />
            </span>
          </a>
        </li>
      </ul>
    </div>
  );
}