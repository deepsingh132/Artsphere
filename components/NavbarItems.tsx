"use client";

import { MusicalNoteIcon } from "@heroicons/react/24/outline";
import { PaintBrushIcon } from "@heroicons/react/24/outline";
import { FilmIcon } from "@heroicons/react/24/outline";
import { BookOpenIcon } from "@heroicons/react/24/outline";

import { useRouter, usePathname } from "next/navigation";

export default function NavbarItems() {

  //TODO: get this from the backend for a dynamic navbar
  const navbarItems = [
    {
      title: "Music",
      icon: MusicalNoteIcon,
      href: "/music",
    },
    {
      title: "Art",
      icon: PaintBrushIcon,
      href: "/art",
    },
    {
      title: "Film",
      icon: FilmIcon,
      href: "/film",
    },
    {
      title: "Literature",
      icon: BookOpenIcon,
      href: "/lit",
    },
  ];

  const router = useRouter();
  const path = usePathname();

  const handleMenuClick = (item: string) => {
    switch (item) {
      case "/music":
        router.replace(`${path}?feed=music`);
        break;
      case "/art":
        router.replace(`${path}?feed=art`);
        break;
      case "/film":
        router.replace(`${path}?feed=film`);
        break;
      case "/lit":
        router.replace(`${path}?feed=lit`);
        break;
    }
  };

  return (
    <div className="hidden w-fit md:flex align-middle flex-grow justify-center items-center">
      <ul
        className="hidden md:text-2xl font-semibold sm:text-l md:flex content-center align-middle justify-center w-full whitespace-nowrap md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0">
        {navbarItems.map((item, index) => (
          <li
            data-testid="navbar-item"
            key={index}
            className="cursor-pointer"
            onClick={() => handleMenuClick(item.href)}
          >
            <a
              href="#"
              className="flex hoverEffect ml-2 w-full justify-center items-center"
              aria-current="page"
            >
              <span className="flex">
                {item.title}
                <item.icon className="h-6 ml-2" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}