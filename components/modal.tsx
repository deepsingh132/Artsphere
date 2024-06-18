`use client`;

import { useEffect } from "react";



export const Modal = ({ children, closeModal }) => {

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "visible";
    };
  } , []);

  // return the children wrapped in the modal component
  return (

    <div
      className="fixed cursor-auto inset-0 !z-[9999] backdrop-blur-sm md:p-10 bg-black bg-opacity-40 flex justify-center items-center !transition-none !duration-0"
      onClick={closeModal}
    >
      <div
        data-testid="modal"
        className="modal relative overflow-y-auto shadow rounded-2xl border dark:border-gray-700 border-cardBorder bg-white dark:bg-darkBg md:max-w-[600px] max-w-[90vw] max-h-[90vh] p-2 opacity-100 transition-none duration-0"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {children}
      </div>
    </div>
    );
}