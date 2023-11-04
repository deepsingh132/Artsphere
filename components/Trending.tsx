import Image from "next/image";

export default function Trending({ post }) {
  // open in same tab
  return (
    <a
      rel="noreferrer"
      href={`${process.env.NEXT_PUBLIC_FRONTEND_URL + "/posts/" + post?._id}`}
      target="_self"
    >
      <div className="flex items-center justify-between px-4 py-2 space-x-1 hover:bg-gray-200 dark:hover:bg-darkHover transition duration-500 ease-out">
        <div className="space-y-0.5">
          {!post?.category ||
            (post?.category === "other" && (
              <p className="text-xs font-medium text-gray-500 ">Trending</p>
            ))}

          {post?.category && post?.category !== "other" && (
            <p className="text-xs font-medium text-gray-500 ">
              {post?.category}
            </p>
          )}
          <h6 className="text-sm font-bold dark:text-darkText">
            {post?.content}
          </h6>
          {post?.tags?.length > 0 && (
            <p className="text-[13px] leading-4 font-medium text-gray-500 ">
              Trending in{" "}
              {post?.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-[13px] font-normal hover:underline text-primary whitespace-pre-wrap"
                >
                  #{tag}
                  {index !== post?.tags?.length - 1 && (
                    <span className="text-xs font-medium text-gray-500 ">
                      ,{" "}
                    </span>
                  )}
                </span>
              ))}
            </p>
          )}
        </div>

        {
          // if post has a youtube url then show the video thumbnail
          post?.url?.includes("youtube") && (
            <Image
              className="rounded-xl "
              height={70}
              width={70}
              unoptimized={true}
              loader={({ src }) => src}
              src={`https://img.youtube.com/vi/${
                post?.url?.split("v=")[1]
              }/0.jpg`}
              alt=""
            />
          )
        }

        {post?.url && !post?.url?.includes("youtube") && (
          <Image
            className="rounded sm:w-[80px] sm:h-[50px] object-cover"
            height={70}
            width={70}
            src={post?.url}
            alt=""
          />
        )}
      </div>
    </a>
  );
}
