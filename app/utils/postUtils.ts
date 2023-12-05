import { backendUrl } from "./config/backendUrl";

// TODO: log errors to Sentry
export const addPost = async (post: Post, accessToken: string | undefined) => {
  if (!accessToken) {
    return;
  }
  try {
    const res = await fetch(`${backendUrl}/posts`, {
    method: "POST",
    body: JSON.stringify(post),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
    const data = await res.json();
    if (data?.message === "success" || res?.status === 200) {
      return true;
    }
  } catch (error) {
    return false;
  }
};

export const addComment = async (
  comment: any,
  accessToken: string | undefined,
  postId: string | undefined
) => {
  if (!accessToken) {
    return;
  }
  try {
    const res = await fetch(`${backendUrl}/posts/${postId}/comment`, {
      method: "PUT",
      body: JSON.stringify(comment),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();

    if (res.status === 200 || data?.message === "Comment added successfully!") {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
};

export const deletePost = async (
  postId: string | undefined,
  accessToken: string | undefined
) => {
  if (!accessToken) {
    return;
  }
  try {
    const res = await fetch(`${backendUrl}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
    if (data?.message === "Post deleted" || data?.status === 200) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
};

export const likePost = async (
  postId: string | undefined,
  userId: string | undefined,
  accessToken: string | undefined
) => {
  if (!accessToken) {
    return;
  }
  try {
    const res = await fetch(`${backendUrl}/posts/${postId}/like`, {
      method: "PUT",
      body: JSON.stringify({ userId }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
    if (
      data?.message === "Like updated successfully!" ||
      data?.status === 200
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }
};

export const deleteComment = async (
  commentId: string | undefined,
  accessToken: string | undefined
) => {
  if (!accessToken) {
    return;
  }
  try {
    const res = await fetch(`${backendUrl}/posts/${commentId}/comment`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
    if (data?.message === "Comment deleted" || res?.status === 200) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
};