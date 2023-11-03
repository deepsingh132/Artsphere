"use client";

import { useRouter } from "next/navigation";
import SignInBtn from "./GoogleBtn";

import { useSession } from "next-auth/react";
export default function UserInfo() {
  const { status, data: session } = useSession();

  const router = useRouter();

  if (status === "authenticated") {
    router.push("/");
  } else {
    return (
      <>
        <SignInBtn />
      </>
    );
  }
}
