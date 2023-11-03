import { atom } from "recoil";
export const modalState = atom({
  key: "modalState", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});

export const postModalState = atom({
  key: "postModalState",
  default: false,
});

export const postIdState = atom({
  key: "postIdState",
  default: "id",
});
