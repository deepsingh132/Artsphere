'use client'

import { RecoilRoot, atom } from "recoil";
import Toggle from "@/components/Toggle";
import { Toaster } from "react-hot-toast";

export const recoilState = atom({
  key: "recoilState",
  default: {},
});

export default function RecoidContextProvider({children}: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <Toaster />
      <Toggle />
      {children}
    </RecoilRoot>
  );
}