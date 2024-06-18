import { db } from "@/db";
import { eq } from "drizzle-orm";
import { CommentType, posts as Posts} from "@/models/Post";
import { NextResponse } from "next/server";


// Private route handle post update
export async function PUT(request: Request) {
  const bearer = request.headers.get("Authorization");
  const userId = request.headers.get("userId");

  if (!bearer) {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }
  const postId = request.url.split("/")[5];

  try {

    const [post] = await db.select().from(Posts).where(eq(Posts._id, postId));

    if (!post) {
      return NextResponse.json({ message: "No posts found" }, { status: 404 });
    }

    const { _id, username, name, userImg, content, timestamp, url } = await request.json();

    const newComment = {
      _id: _id,
      userId: userId,
      content: content,
      username: username,
      timestamp: timestamp,
      url: url,
      userImg: userImg,
      name: name,
    };

    // if post.comments is null, create a new array
    if (!post.comments) {
      post.comments = [];
    }

    post.comments.push(newComment);

    await Promise.all([
      db.update(Posts).set({ comments: post.comments }).where(eq(Posts._id, postId)),
    ]);

    return NextResponse.json({ post: newComment }, { status: 200 });
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const userId = request.headers.get("userId");
  const commentId = request.url.split("/")[5];
  const body = await request.json();

  const postId = body.postId;

  if (!userId || !commentId || !postId) {
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });
  }

  try {
    // find the original post
    const [post] = await db.select().from(Posts).where(eq(Posts._id, postId));

    if (!post) {
      return NextResponse.json({ message: "No posts found" }, { status: 404 });
    }

    const comments = post.comments as CommentType[];

    // check if the user is the author of the comment
    const comment = comments.find((comment) => {
      return comment?.userId === userId && comment?._id === commentId;
    });

    if (!comment) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    // delete comment from post.comments array
    const newComments = post.comments?.filter((comment: CommentType) => {
      return comment._id.toString() !== commentId;
    });

    // update the post with the new comments array
    await db.update(Posts).set({ comments: newComments }).where(eq(Posts._id, post._id));

    return NextResponse.json({ message: "Comment deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error: ", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}