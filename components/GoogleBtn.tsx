'use client'

import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function GoogleBtn() {

  return (
    <>
      <button
        type="button"
        role="btn"
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="flex bg-transparent w-1/4 max-w-[250px] dark:bg-darkCard rounded-3xl h-[40px] p-[10px] hover:bg-[#E6E6E6] dark:hover:bg-darkHover hover:shadow-md transition-all duration-300 ease-in-out min-w-fit outline-none items-center justify-center mt-10 border border-gray-700 whitespace-nowrap"
      >
        <span className="flex items-center justify-between text-text dark:text-darkText font-bold">
          <Image
            src="/google.png"
            referrerPolicy="no-referrer"
            width={20}
            height={20}
            alt="Google"
            className="mx-2"
          />
          Sign in with Google
        </span>
      </button>
    </>
  );
}