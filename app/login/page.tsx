import UserInfo from "@/components/UserInfo";

export default function Login({}) {
  return (
    <main className="flex min-h-screen relative mx-auto">
      <div className="flex flex-col w-screen h-screen dark:bg-darkBg items-center align-middle justify-center">
        {/* <div className="flex flex-col h-full items-center justify-center"> */}
        <h1 className=" font-black text-text dark:text-darkText text-5xl">Login using Google</h1>
        <UserInfo />
        {/* </div> */}
      </div>
    </main>
  );
}
