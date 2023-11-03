'use client';

import { useEffect } from "react";

// export as a react component
export default function Toggle():  JSX.Element {



  useEffect(() => {
    const initialMode = localStorage.getItem("mode") || "light";
    if (initialMode === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("mode", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("mode", "light");
    }
  }, []);
  return <></>
}