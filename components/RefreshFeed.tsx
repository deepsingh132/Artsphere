"use client";
import Feed from "@/components/Feed";
import { useSearchParams } from "next/navigation";
export default function RefreshFeed() {

  const searchParams = useSearchParams();

  const path = searchParams.get("feed");

  const handleType = (type: string) => {
    switch (type) {
      case "music":
        return <Feed type={"music"} />;
      case "art":
        return <Feed type={"art"} />;
      case "film":
        return <Feed type={"film"} />;
      case "lit":
        return <Feed type={"lit"} />;
    }
  }
  return (
    <div className="flex flex-col">
      { path?
         handleType(path) : <Feed type={undefined} />
      }
    </div>
  );
}