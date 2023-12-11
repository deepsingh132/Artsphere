import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/components/Toast", () => {
  return {
    toastError: jest.fn(),
    toastSuccess: jest.fn(),
    toastLoading: jest.fn(),
    toastDismiss: jest.fn(),
    toastPromise: jest.fn(),
  };
});
global.confirm = jest.fn(() => true);

import Post from "@/components/Post";
import { RecoilRoot } from "recoil";
import { postModalState } from "@/app/atom/modalAtom";
// import { useRouter, useSearchParams } from "next/navigation";

// Mock useRouter and usePathname
jest.mock("next/navigation");
const pushMock = jest.fn();

const useRouter = jest.spyOn(require("next/navigation"), "useRouter");
const useSearchParams = jest.spyOn(
  require("next/navigation"),
  "useSearchParams"
);

useRouter.mockReturnValue({
  push: pushMock,
});

// Mock useSearchParams
useSearchParams.mockReturnValue({
  toString: () => toString,
});

const useSession = jest.spyOn(require("next-auth/react"), "useSession");

describe("Post", () => {
  const posts = [
    // without any media
    {
      _id: 1,
      userImg: "https://picsum.photos/200",
      name: "John Doe",
      username: "johndoe132",
      authorID: "12345",
      likes: ["12345"],
      content: "This is a post without any media",
      createdAt: "2021-01-01T00:00:00.000Z",
      updatedAt: "2021-01-01T00:00:00.000Z",
    },
    // with media
    {
      _id: 2,
      userImg: "https://picsum.photos/200",
      name: "Jane Doe",
      username: "janedoe132",
      authorID: "9876",
      content: "Lorem ipsum dolor sit amet",
      url: "https://picsum.photos/200",
      createdAt: "2021-01-01T00:00:00.000Z",
      updatedAt: "2021-01-01T00:00:00.000Z",
    },
    // with youtube embed
    {
      _id: 3,
      userImg: "https://picsum.photos/200",
      name: "Jane Doe",
      username: "janedoe132",
      authorID: "9876",
      likes: [""],
      content: "Lorem ipsum dolor sit amet",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      createdAt: "2021-01-01T00:00:00.000Z",
      updatedAt: "2021-01-01T00:00:00.000Z",
    },
    // liked post
    {
      _id: 4,
      userImg: "https://picsum.photos/200",
      name: "Jane Doe",
      username: "janedoe132",
      authorID: "9876",
      likes: ["123456"],
      content: "Lorem ipsum dolor sit amet",
      createdAt: "2021-01-01T00:00:00.000Z",
      updatedAt: "2021-01-01T00:00:00.000Z",
    },
  ];

  it("renders the post component", () => {
    useSession.mockReturnValue({
      status: "unauthenticated",
      data: null,
    });
    render(
      <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
        <Post
          key={posts[0]?._id}
          post={posts[0]}
          id={posts[0]?._id}
          updatePosts={() => {}}
        />
        <Post
          key={posts[1]?._id}
          post={posts[1]}
          id={posts[1]?._id}
          updatePosts={() => {}}
        />
        <Post
          key={posts[2]?._id}
          post={posts[2]}
          id={posts[2]?._id}
          updatePosts={() => {}}
        />
      </RecoilRoot>
    );
    // Assert that all posts are rendered
    const postComponents = screen.getAllByTestId("post");
    expect(postComponents.length).toBe(3);

    const post = screen.getByText("This is a post without any media");
    expect(post).toBeInTheDocument();

    // Assert that the image is rendered
    const image = screen.getByTestId("post-image");
    expect(image).toBeInTheDocument();

    // Assert that the youtube embed is rendered
    const youtubeEmbed = screen.getByTestId("post-youtube-embed");
    expect(youtubeEmbed).toBeInTheDocument();
  });

  it("renders a post with a like button", () => {
    useSession.mockReturnValue({
      status: "authenticated",
      data: {
        user: {
          id: "9876",
          email: "test@example.com",
          image: "https://example.com/image.jpg",
          name: "Test User",
        },
      },
    });

    render(
      <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
        <Post
          key={posts[0]?._id}
          post={posts[0]}
          id={posts[0]?._id}
          updatePosts={() => {}}
        />
      </RecoilRoot>
    );
    // Assert that the post is rendered
    const postComponent = screen.getByTestId("post");
    expect(postComponent).toBeInTheDocument();

    const likeButton = screen.getByTestId("post-like-button");
    expect(likeButton).toBeInTheDocument();
  });

  it("renders a post with a like filled button", () => {
    useSession.mockReturnValue({
      status: "authenticated",
      data: {
        user: {
          id: "12345",
          email: "test@example.com",
          image: "https://example.com/image.jpg",
          name: "Test User",
        },
      },
    });

    render(
      <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
        <Post
          key={posts[0]?._id}
          post={posts[0]}
          id={posts[0]?._id}
          updatePosts={() => {}}
        />
      </RecoilRoot>
    );
    // Assert that the post is rendered
    const postComponent = screen.getByTestId("post");
    expect(postComponent).toBeInTheDocument();

    const likeFilledButton = screen.getByTestId("post-like-button-filled");
    expect(likeFilledButton).toBeInTheDocument();
  });

  it("renders a post with a like button that redirects users to the login page when they are not logged in", async () => {
    useSession.mockReturnValue({
      status: "unauthenticated",
      data: null,
    });

    render(
      <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
        <Post
          key={posts[0]?._id}
          post={posts[0]}
          id={posts[0]?._id}
          updatePosts={() => {}}
        />
      </RecoilRoot>
    );
    // Assert that the post is rendered
    const postComponent = screen.getByTestId("post");
    expect(postComponent).toBeInTheDocument();

    // Assert that on click of the like button, the user is redirected to the login page
    const likeButton = screen.getByTestId("post-like-button");
    expect(likeButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(likeButton);
    expect(pushMock).toHaveBeenCalledWith(`/login`);
  });

  it("renders a post with a delete button when logged in as the author of a post", () => {
    useSession.mockReturnValue({
      status: "authenticated",
      data: {
        user: {
          id: "12345",
          email: "test@email.com",
          image: "https://example.com/image.jpg",
          name: "Test User",
        },
      },
    });

    render(
      <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
        <Post
          key={posts[0]?._id}
          post={posts[0]}
          id={posts[0]?._id}
          updatePosts={() => {}}
        />
      </RecoilRoot>
    );
    // Assert that the post is rendered
    const postComponent = screen.getByTestId("post");
    expect(postComponent).toBeInTheDocument();

    const deleteButton = screen.getByTestId("post-delete-button");
    expect(deleteButton).toBeInTheDocument();
  });

  it("renders a post without a delete button when logged in as not the author of a post", () => {
    useSession.mockReturnValue({
      status: "authenticated",
      data: {
        user: {
          id: "9876",
          email: "email@test.com",
          image: "https://example.com/image.jpg",
          name: "Test User",
        },
      },
    });

    render(
      <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
        <Post
          key={posts[0]?._id}
          post={posts[0]}
          id={posts[0]?._id}
          updatePosts={() => {}}
        />
      </RecoilRoot>
    );

    // Assert that the post is rendered
    const postComponent = screen.getByTestId("post");
    expect(postComponent).toBeInTheDocument();

    const deleteButton = screen.queryByTestId("post-delete-button");
    expect(deleteButton).not.toBeInTheDocument();
  });

  it("makes a request to like an unliked post when the like button is clicked", async () => {
    useSession.mockReturnValue({
      status: "authenticated",
      data: {
        user: {
          id: "9876",
          email: "test@email.com",
          image: "https://example.com/image.jpg",
          name: "Test User",
          accessToken: "example-access-token",
        },
      },
    });

    // const updatePosts = jest.fn();

    render(
      <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
        <Post
          key={posts[0]?._id}
          post={posts[0]}
          id={posts[0]?._id}
          updatePosts={() => {}}
        />
      </RecoilRoot>
    );

    // Assert that the post is rendered
    const postComponent = screen.getByTestId("post");
    expect(postComponent).toBeInTheDocument();

    const likeButton = screen.getByTestId("post-like-button");
    expect(likeButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(likeButton);

    // Assert that the like button is now filled
    const likeFilledButton = screen.getByTestId("post-like-button-filled");
    expect(likeFilledButton).toBeInTheDocument();
  });

  it("makes a request to unlike a liked post when the like button is clicked", async () => {
    useSession.mockReturnValue({
      status: "authenticated",
      data: {
        user: {
          id: "12345",
          email: "test@email.com",
          image: "https://example.com/image.jpg",
          name: "Test User",
          accessToken: "example-access-token",
        },
      },
    });

    // const updatePosts = jest.fn();

    render(
      <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
        <Post
          key={posts[0]?._id}
          post={posts[0]}
          id={posts[0]?._id}
          updatePosts={() => {}}
        />
      </RecoilRoot>
    );

    // Assert that the post is rendered
    const postComponent = screen.getByTestId("post");
    expect(postComponent).toBeInTheDocument();

    // Assert that the like button is filled
    const likeButton = screen.getByTestId("post-like-button-filled");
    expect(likeButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(likeButton);

    // Assert that the like button is now unfilled
    const likeFilledButton = screen.getByTestId("post-like-button");
    expect(likeFilledButton).toBeInTheDocument();
  });

  it("fails to like an unliked post and rolls back the optimistic update", async () => {
    useSession.mockReturnValue({
      status: "authenticated",
      data: {
        user: {
          id: "0000",
          email: "test@email.com",
          image: "https://example.com/image.jpg",
          name: "Test User",
          accessToken: undefined,
        },
      },
    });

    // const updatePosts = jest.fn();

    const { rerender } = render(
      <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
        <Post
          key={posts[3]?._id}
          post={posts[3]}
          id={posts[3]?._id}
          updatePosts={() => {}}
        />
      </RecoilRoot>
    );

    // Assert that the post is rendered
    const postComponent = screen.getByTestId("post");
    expect(postComponent).toBeInTheDocument();

    // Assert that the like button is rendered
    const likeButton = screen.getByTestId("post-like-button");
    expect(likeButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(likeButton);

    // rerender the component to update the like button
    rerender(
      <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
        <Post
          key={posts[3]?._id}
          post={posts[3]}
          id={posts[3]?._id}
          updatePosts={() => {}}
        />
      </RecoilRoot>
    );

    // Assert that the like button is still unfilled
    const likeButton2 = screen.getByTestId("post-like-button");
    expect(likeButton2).toBeInTheDocument();
  });

  it("fails to unlike a liked post and rolls back the optimistic update", async () => {
    useSession.mockReturnValue({
      status: "authenticated",
      data: {
        user: {
          id: "123456",
          email: "test@email.com",
          image: "https://example.com/image.jpg",
          name: "Test User",
          accessToken: undefined,
        },
      },
    });

    // const updatePosts = jest.fn();

   const {rerender} = render(
      <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
        <Post
          key={posts[3]?._id}
          post={posts[3]}
          id={posts[3]?._id}
          updatePosts={() => {}}
        />
      </RecoilRoot>
    );

    // Assert that the post is rendered
    const postComponent = screen.getByTestId("post");
    expect(postComponent).toBeInTheDocument();

    // Assert that the like button is filled
    const likeButton = screen.getByTestId("post-like-button-filled");
    expect(likeButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(likeButton);


    // rerender the component to update the like button
    rerender(
      <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
        <Post
          key={posts[3]?._id}
          post={posts[3]}
          id={posts[3]?._id}
          updatePosts={() => {}}
        />
      </RecoilRoot>
    );

    // Assert that the like button is still filled
    const likeButton2 = screen.getByTestId("post-like-button-filled");
    expect(likeButton2).toBeInTheDocument();
  });

  it("deletes a post when the delete button is clicked as the author of a post", async () => {
    useSession.mockReturnValue({
      status: "authenticated",
      data: {
        user: {
          id: "12345",
          email: "email@test.com",
          image: "https://example.com/image.jpg",
          name: "Test User",
          accessToken: "example-access-token",
        },
      },
    });

    const { rerender } = render(
      <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
        <Post
          key={posts[0]?._id}
          post={posts[0]}
          id={posts[0]?._id}
          updatePosts={() => {}}
        />
      </RecoilRoot>
    );

    // Assert that the post is rendered
    const postComponent = screen.getByTestId("post");
    expect(postComponent).toBeInTheDocument();

    const deleteButton = screen.getByTestId("post-delete-button");
    expect(deleteButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(deleteButton);

    // Assert that the window.confirm function was called
    expect(global.confirm).toHaveBeenCalledTimes(1);
  });

  it("fails to delete a post and rolls back the optimistic update", async () => {
    useSession.mockReturnValue({
      status: "authenticated",
      data: {
        user: {
          id: "12345",
          email: "test@email.com",
          image: "https://example.com/image.jpg",
          name: "Test User",
          accessToken: undefined,
        },
      },
    });

    // const updatePosts = jest.fn();

    const { rerender } = render(
      <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
        <Post
          key={posts[0]?._id}
          post={posts[0]}
          id={posts[0]?._id}
          updatePosts={() => {}}
        />
      </RecoilRoot>
    );

    // Assert that the post is rendered
    const postComponent = screen.getByTestId("post");
    expect(postComponent).toBeInTheDocument();

    // Assert that the delete button is rendered
    const deleteButton = screen.getByTestId("post-delete-button");
    expect(deleteButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(deleteButton);

    rerender(
      <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
        <Post
          key={posts[0]?._id}
          post={posts[0]}
          id={posts[0]?._id}
          updatePosts={() => {}}
        />
      </RecoilRoot>
    );

    // Assert that the delete button is still rendered
    const deleteButton2 = screen.getByTestId("post-delete-button");
    expect(deleteButton2).toBeInTheDocument();
  });

  it("redirect to the user's profile page when the user clicks on the user's username/pfp", async () => {
    useSession.mockReturnValue({
      status: "authenticated",
      data: {
        user: {
          id: "12345",
          email: "email@test.com",
          image: "https://example.com/image.jpg",
        },
      },
    });

    // const updatePosts = jest.fn();

    render(
      <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
        <Post
          key={posts[1]?._id}
          post={posts[1]}
          id={posts[1]?._id}
          updatePosts={() => {}}
        />
      </RecoilRoot>
    );

    // Assert that the post is rendered
    const postComponent = screen.getByTestId("post");
    expect(postComponent).toBeInTheDocument();

    // Assert that the user's username is rendered
    const username = screen.getByTestId("post-username");
    expect(username).toBeInTheDocument();

    // Assert that the post content is rendered
    const content = screen.getByTestId("post-content");
    expect(content).toBeInTheDocument();

    // Assert that the post text is rendered
    const text = screen.getByTestId("post-text");
    expect(text).toBeInTheDocument();

    // Assert that the post's image is rendered
    const image = screen.getByTestId("post-image");
    expect(image).toBeInTheDocument();

    const userImg = screen.getByTestId("post-user-image");
    expect(userImg).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(userImg);
    // Assert that the user is redirected to the user's profile page
    expect(pushMock).toHaveBeenCalledWith(`/${posts[1]?.username}`);

    await user.click(username);
    // Assert that the user is redirected to the user's profile page
    expect(pushMock).toHaveBeenCalledWith(`/${posts[1]?.username}`);

    await user.click(content);
    // Assert that the user is redirected to the post page
    expect(pushMock).toHaveBeenCalledWith(`/posts/${posts[1]?._id}`);

    await user.click(text);
    // Assert that the user is redirected to the post page
    expect(pushMock).toHaveBeenCalledWith(`/posts/${posts[1]?._id}`);

    await user.click(image);
    // Assert that the user is redirected to the post page
    expect(pushMock).toHaveBeenCalledWith(`/posts/${posts[1]?._id}`);
  });

  it("redirects to the login page when an unauthenticated user clicks on the comment button", async () => {
    useSession.mockReturnValue({
      status: "unauthenticated",
      data: null,
    });

    // const updatePosts = jest.fn();

    render(
      <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
        <Post
          key={posts[1]?._id}
          post={posts[1]}
          id={posts[1]?._id}
          updatePosts={() => {}}
        />
      </RecoilRoot>
    );

    // Assert that the post is rendered
    const postComponent = screen.getByTestId("post");
    expect(postComponent).toBeInTheDocument();

    // Assert that the comment button is rendered
    const commentButton = screen.getByTestId("post-comment-button");
    expect(commentButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(commentButton);

    // Assert that the user is redirected to the login page
    expect(pushMock).toHaveBeenCalledWith(`/login`);

  });

  it("renders the comment modal when an authenticated user clicks on the comment button", async () => {
  useSession.mockReturnValue({
    status: "authenticated",
    data: {
      user: {
        id: "12345",
        email: "email@test.com",
        image: "https://example.com/image.jpg",
      },
    },
  });

    // const updatePosts = jest.fn();

    render(
      <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
        <Post
          key={posts[0]?._id}
          post={posts[0]}
          id={posts[0]?._id}
          updatePosts={() => {}}
        />
      </RecoilRoot>
    );

    // Assert that the post is rendered
    const postComponent = screen.getByTestId("post");
    expect(postComponent).toBeInTheDocument();

    // Assert that the comment button is rendered
    const commentButton = screen.getByTestId("post-comment-button");
    expect(commentButton).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(commentButton);
  });

});
