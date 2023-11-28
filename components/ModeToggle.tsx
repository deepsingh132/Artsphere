'use client';
import { useEffect, useState } from "react";
import "./toggle_mode.css";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { toastSuccess } from "./Toast";
import { useTheme } from "next-themes";

export default function ModeToggle() {

  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    // set the toggle state based on the resolved theme
    if (resolvedTheme === "dark") {
      document?.getElementById("darkModeToggle")?.classList.add("dark");
      document?.getElementById("icon")?.classList.toggle("moon");
    } else {
      document?.getElementById("darkModeToggle")?.classList.remove("dark");
      document?.getElementById("icon")?.classList.toggle("sun");
    }

  }, [resolvedTheme]);

  const toggleMode = () => {
    if (!mounted) return;

    const toggleClasses = (id: string, newClass: string, oldClass: string) => {
      const element = document?.getElementById(id);
      element?.classList.remove(oldClass);
      element?.classList.add(newClass);
    };

    const showToast = (message: string, color: string) => {
      toastSuccess(message, {
        style: {
          background: color,
          color: color === "#fff" ? "#333" : "#fff",
          zIndex: 1,
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
        },
        duration: 3000,
      });
    };
    if (resolvedTheme === "dark") {
      setTheme("light");
      toggleClasses("icon", "sun", "moon");
      document?.getElementById("darkModeToggle")?.classList.remove("dark");
      showToast("Light mode enabled", "#fff");
    } else {
      setTheme("dark");
      toggleClasses("icon", "sun", "sun");
      document?.getElementById("darkModeToggle")?.classList.add("dark");
      showToast("Dark mode enabled", "#333");
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="toggle-container">
        <div
          data-testid="dark-mode-toggle"
          className={
            resolvedTheme === "dark"
              ? "toggle dark"
              : "toggle"
          }
          onClick={toggleMode}
          id="darkModeToggle"
        >
          <div className="icon sun" id="icon">
            {
              resolvedTheme === "dark" ? (
                <MoonIcon className="text-black" id="sun" />
              ) : (
                <SunIcon className="text-black" id="moony" />
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}