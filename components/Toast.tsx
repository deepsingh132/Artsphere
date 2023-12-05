import toast from "react-hot-toast";

let theme = "light";
if (typeof window !== "undefined") {
  // get system preference
  const systemPreference = window.matchMedia("(prefers-color-scheme: dark)")
    .matches
    ? "dark"
    : "light";
  theme = localStorage.getItem("theme") || systemPreference;
}

  // toast config
  const toastConfig = {
    style: {
      background: theme === "light" ? "#fff" : "#333",
      color: theme === "light" ? "#333" : "#fff",
      zIndex: 1,
      boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
    },
    duration: 2500,
  };

  export const toastError = (message: string, style: any) => {
    toast.error(message, style || toastConfig);
  };

  export const toastSuccess = (message: string, style: any) => {
    toast.success(message, style || toastConfig);
  };

  export const toastLoading = (message: string, style: any) => {
    toast.loading(message, style || toastConfig);
  };

  export const toastDismiss = () => {
    toast.dismiss();
  };

  export const toastPromise = (
    promise: Promise<any>,
    successMessage: string,
    errorMessage: string
  ) => {
    toast.promise(promise, {
      loading: "Loading",
      success: () => successMessage,
      error: () => errorMessage,
    });
  };
