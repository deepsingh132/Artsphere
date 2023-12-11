/* eslint-disable testing-library/no-unnecessary-act */
import {
  act,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { RecoilRoot } from "recoil";
import Feed from "@/components/Feed";
import { postModalState } from "@/app/atom/modalAtom";
import userEvent from "@testing-library/user-event";
import { SWRConfig } from "swr";
import { server } from "@/__mocks__/server";
import { HttpResponse, http } from "msw";
import { backendUrl } from "@/app/utils/config/backendUrl";

global.confirm = jest.fn(() => true); // mock window.confirm

// Mock useRouter and usePathname
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
      push: () => null,
      replace: () => null,
    };
  },
  usePathname() {
    return "/";
  },
  useSearchParams() {
    return {
      get: () => null,
    };
  },
}));

const useSession = jest.spyOn(require("next-auth/react"), "useSession");

jest.mock("../components/Toast", () => {
  return {
    toastError: jest.fn(),
    toastSuccess: jest.fn(),
    toastLoading: jest.fn(),
    toastDismiss: jest.fn(),
    toastPromise: jest.fn(),
  };
});

describe("Feed Component", () => {
  const searchParams = {
    feed: undefined,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useSession.mockReturnValue({
      status: "authenticated",
      data: {
        user: {
          id: "12345",
          email: "test@example.com",
          image: "https://example.com/image.jpg",
          name: "Test User",
          accessToken: "example-access-token",
        },
      },
    });
  });

  it("should render the Feed component", () => {
    render(
      <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
        <Feed type={searchParams.feed} />
      </RecoilRoot>
    );
    const feed = screen.getByTestId("feed");
    expect(feed).toBeInTheDocument();
  });

  it("should render the Feed component with a type", async () => {
    const searchParamsMusic = {
      feed: "music",
    };

    act(() => {
      render(
        <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
          <Feed type={searchParamsMusic.feed} />
        </RecoilRoot>
      );
    });

    await screen.findByRole("feed");
    const feed = screen.getByTestId("feed");
    expect(feed).toBeInTheDocument();
  });

  it("should render the floating button inside feed component and open the modal", async () => {
    // Mock window.innerWidth to be 500 for the floating button to be rendered
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });

    // global.innerWidth = 500;
    // global.dispatchEvent(new Event("resize"));

    act(() => {
      render(
        <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
          <Feed type={searchParams.feed} />
        </RecoilRoot>
      );
    });

    await screen.findByRole("feed");
    const feed = screen.getByTestId("feed");
    expect(feed).toBeInTheDocument();

    // Assert that the floating button is in the document
    const floatingButton = screen.getByTestId("feed-fab");
    expect(floatingButton).toBeInTheDocument();

    // Assert that the floating button has the icon
    const floatingButtonIcon = screen.getByTestId("feed-fab-icon");
    expect(floatingButtonIcon).toBeInTheDocument();

    // Assert that the modal is not in the document
    const modal = screen.queryByTestId("modal");
    expect(modal).not.toBeInTheDocument();

    // Click the floating button
    //await userEvent.click(floatingButton);
    fireEvent.click(floatingButton);

    // Assert that the modal is in the document
    const modal2 = screen.getByTestId("modal");
    expect(modal2).toBeInTheDocument();

    // Assert that the modal has the text "Create a Post"
    const modalText = screen.getByText("Create a post");
    expect(modalText).toBeInTheDocument();

    // Assert that the modal also renders the Input component
    const inputs = screen.getAllByTestId("input");
    expect(inputs).toHaveLength(2);

    // reset window.innerWidth to 1024
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it("should add a reply to a post", async () => {
    act(() => {
      render(
        <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
          <Feed type={searchParams.feed} />
        </RecoilRoot>
      );
    });

    await screen.findByRole("feed");
    const feed = screen.getByTestId("feed");
    expect(feed).toBeInTheDocument();

    // Assert that the comment count span is not in the document
    const commentCount = screen.queryByTestId("post-comment-count");
    expect(commentCount).not.toBeInTheDocument();

    const commentBtn = screen.getAllByTestId("post-comment-button")[0];
    expect(commentBtn).toBeInTheDocument();

    // Click the comment button
    await userEvent.click(commentBtn);

    // Assert that the modal is in the document
    const modal = screen.getByTestId("modal");
    expect(modal).toBeInTheDocument();

    // Assert that the modal type is "comment-modal"
    const commentModal = screen.getByTestId("comment-modal");
    expect(commentModal).toBeInTheDocument();

    // Assert that the input component of the comment modal is in the document
    const input = screen.getAllByTestId("input")[1];
    expect(input).toBeInTheDocument();

    // wait for the post to be fetched
    await screen.findByTestId("comment-modal-post");

    // Assert that the post which was clicked on is in the comment modal
    const post = screen.getByTestId("comment-modal-post");
    expect(post).toBeInTheDocument();

    // Assert that the input container of the comment modal is in the document
    const inputConatiner = screen.getAllByTestId("input-container")[1];
    expect(inputConatiner).toBeInTheDocument();

    // // Assert that the input field is in the input container of the comment modal
    const inputField = screen.getAllByTestId("input-custom-inputField")[1];
    expect(inputField).toBeInTheDocument();

    // // Assert that the input field has the placeholder text of reply
    expect(inputField).toHaveAttribute("placeholder", "Post your reply");
    expect(inputField).toHaveAttribute("contentEditable", "true");

    // Assert that the post button is in the input container
    const postButton = screen.getAllByTestId("input-post-button")[1];
    expect(postButton).toBeInTheDocument();

    // Assert that the post button is disabled
    expect(postButton).toBeDisabled();

    // Assert that the button text is "Reply"
    expect(postButton).toHaveTextContent("Reply");

    const inputText = "Test Reply Comment Text";
    const inputElement = screen.getAllByTestId("input-custom-inputField")[1];
    fireEvent.input(inputElement, { target: { innerText: inputText } });
    expect(inputElement.innerText).toBe(inputText);

    // Assert that the post button is not disabled
    expect(postButton).toBeEnabled();

    // Click the post button
    await userEvent.click(postButton);

    // Assert that the comment was created and the comment length is increased by 1
    const commentsLength = screen.getByTestId("post-comment-count");
    expect(commentsLength).toHaveTextContent("1");
  });

  it("should add a post to the feed", async () => {
    act(() => {
      render(
        <SWRConfig
          value={{
            // dedupingInterval: 0,
            provider: () => new Map(),
          }}
        >
          <RecoilRoot
            initializeState={(snap) => snap.set(postModalState, false)}
          >
            <Feed type={searchParams.feed} />
          </RecoilRoot>
        </SWRConfig>
      );
    });

    await screen.findByRole("feed");
    const feed = screen.getByTestId("feed");
    expect(feed).toBeInTheDocument();

    // Assert that the input component is in the document
    const input = screen.getByTestId("input");
    expect(input).toBeInTheDocument();

    // Assert that the input container is in the document
    const inputContainer = screen.getByTestId("input-container");
    expect(inputContainer).toBeInTheDocument();

    // Assert that the user avatar is in the input container
    const userAvatar = screen.getByTestId("input-user-avatar");
    expect(userAvatar).toBeInTheDocument();

    // Assert that the input field is in the input container
    const inputField = screen.getByTestId("input-custom-inputField");
    expect(inputField).toBeInTheDocument();

    // Assert that the input field has the placeholder text
    expect(inputField).toHaveAttribute("placeholder", "What's on your mind?");
    expect(inputField).toHaveAttribute("contentEditable", "true");

    // Assert that the photo icon is in the input container
    const photoIcon = screen.getByTestId("input-photo-icon");
    expect(photoIcon).toBeInTheDocument();

    // Assert that the post button is in the input container
    const postButton = screen.getByTestId("input-post-button");
    expect(postButton).toBeInTheDocument();

    // Assert that the post button is disabled
    expect(postButton).toBeDisabled();

    // Assert that the button text is "Post"
    expect(postButton).toHaveTextContent("Post");

    const inputText = "Test Input Text";
    // The input field is a content editable span with onChange event handler that updates the state of the input field
    const inputElement = screen.getByTestId("input-custom-inputField");
    fireEvent.input(inputElement, { target: { innerText: inputText } });
    expect(inputElement.innerText).toBe(inputText);

    // Assert that the post button is not disabled
    expect(postButton).toBeEnabled();

    // Click the post button
    await userEvent.click(postButton);

    // Assert that the post was created and is in the document with other posts
    const posts = screen.getAllByTestId("post");
    expect(posts).toHaveLength(4);

    // Assert that the post with the input text is in the document
    const post = screen.getByText(inputText);
    expect(post).toBeInTheDocument();
  });

  it("should delete a post from the feed component", async () => {
    const mockPosts = [
      {
        _id: 1,
        userImg: "https://picsum.photos/200",
        name: "John Doe",
        username: "johndoe132",
        authorID: "12345",
        likes: [],
        comments: [],
        content: "Post to be deleted",
        createdAt: "2021-01-01T00:00:00.000Z",
        updatedAt: "2021-01-01T00:00:00.000Z",
      },
    ];

    // Override the default msw response for the /api/posts route
    server.use(
      http.get(`${backendUrl}/posts`, () => {
        return HttpResponse.json({
          posts: mockPosts, // return mock posts
        });
      })
    );

    act(() => {
      render(
        <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
          <SWRConfig
            value={{
              provider: () => new Map(), // disable cache
            }}
          >
            <Feed type={searchParams.feed} />
          </SWRConfig>
        </RecoilRoot>
      );
    });

    await screen.findByRole("feed");
    const feed = screen.getByTestId("feed");
    expect(feed).toBeInTheDocument();

    // Assert that the posts length is 1
    const posts = screen.getAllByTestId("post");
    expect(posts).toHaveLength(1);

    // Assert that the post to be deleted is in the document
    const postToBeDeleted = screen.queryByText("Post to be deleted");
    expect(postToBeDeleted).toBeInTheDocument();

    // Assert that the delete button is in the document
    const deleteButton = screen.getByTestId("post-delete-button");
    expect(deleteButton).toBeInTheDocument();

    // Click the delete button
    await userEvent.click(deleteButton);

    // Assert that the post was deleted and the feed is empty
    const posts2 = screen.queryByTestId("post");
    expect(posts2).not.toBeInTheDocument();

    // Assert that the deleted post is not in the document
    const post = screen.queryByText("Post to be deleted");
    expect(post).not.toBeInTheDocument();

    // Assert that the feed now has the text "No posts found" and "try posting something!"
    const noPostsText = screen.getByText("No posts found");
    expect(noPostsText).toBeInTheDocument();
    const tryPostingText = screen.getByText("Try posting something!");
    expect(tryPostingText).toBeInTheDocument();
  });
});
