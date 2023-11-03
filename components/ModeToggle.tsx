'use client';
import { useState, useEffect } from "react";
import "./toggle_mode.css";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { toastSuccess } from "./Toast";

export default function ModeToggle() {

  const initialMode = localStorage.getItem("mode") || "light";
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("mode", "dark");
      document?.getElementById("icon")?.classList.toggle("moon");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("mode", "light");
    }
  }, [mode, initialMode]);


  const toggleMode = () => {
    if (mode === "dark") {
      localStorage.setItem("mode", "light");
      setMode("light");
      document?.getElementById("icon")?.classList.toggle("moon");
      toastSuccess("Light mode enabled", {
        style: {
          background: "#fff",
          color: "#333",
          zIndex: 1,
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
        },
        duration: 3000,
      });
    } else {
      localStorage.setItem("mode", "dark");
      setMode("dark");
      toastSuccess("Dark mode enabled", {
        style: {
          background: "#333",
          color: "#fff",
          zIndex: 1,
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
        },
      }
      );
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="toggle-container">
        <div
          className={mode === "dark" ? "toggle dark" : "toggle"}
          onClick={toggleMode}
          id="darkModeToggle"
        >
          <div className="icon sun" id="icon">
            {mode === "dark" ? (
              <MoonIcon className="text-black" id="moon" />
            ) : (
              <SunIcon className="text-black" id="sun" />
            )
            }
          </div>
        </div>
      </div>
    </div>
  );
}
          // {
          //   // if mode is dark then show moon else show sun
          //   mode === "dark" ? (
          //     <MoonIcon
          //       className="icon moon transition-transform duration-500"
          //       id="moon"
          //     />
          //   ) : (
          //     <SunIcon
          //       className="icon sun transition-transform duration-500"
          //       id="sun"
          //     />
          //   );
          // }