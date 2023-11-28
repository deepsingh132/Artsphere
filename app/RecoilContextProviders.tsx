'use client'

import { RecoilRoot, atom } from "recoil";
import { Toaster } from "react-hot-toast";

export const recoilState = atom({
  key: "recoilState",
  default: {},
});

export default function RecoilContextProvider({children}: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <Toaster />
      {children}
    </RecoilRoot>
  );
}