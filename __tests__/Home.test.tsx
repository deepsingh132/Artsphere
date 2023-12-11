/**
 * @jest-environment jsdom
 */

import { act, fireEvent, render, screen } from "@testing-library/react";
import { RecoilRoot } from "recoil";

import Home from "@/app/page";
import { postModalState } from "@/app/atom/modalAtom";

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
const searchParams = {
  type: undefined,
};

jest.mock("../components/Toast", () => {
  // const originalModule = jest.requireActual('../components/Toast');
  return {
    // ...originalModule,
    toastError: jest.fn(),
    toastSuccess: jest.fn(),
    toastLoading: jest.fn(),
    toastDismiss: jest.fn(),
    toastPromise: jest.fn(),
  };
});

// mock next/themes to return system preference and use actual next/themes for useTheme and setTheme
jest.mock("next-themes", () => ({
  useTheme: () => {
    return {
      setTheme:
        // add the dark class to the document element
        (theme: string) => {
          if (theme === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        },
      resolvedTheme: "light",
    };
  },
}));
//user agnostic tests for the Home component
describe("Home Component", () => {

  it("renders the Home Component", async () => {
    // Mock the useSession hook to return an unauthenticated user (default)
    useSession.mockReturnValue({
      status: "unauthenticated",
      data: null,
    });

    render(
      <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
        {await Home({ searchParams })}
      </RecoilRoot>
    );

    // Wait for the asynchronous data fetching to complete
    await screen.findByRole("main");

    // Assert that the main role exists in the component
    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeInTheDocument();

    // Assert that the sidebar was rendered
    const sidebarElementHome = screen.getByText("Home");
    const sidebarElementForYou = screen.getByText("For You");
    const sidebarElementEvents = screen.getByText("Events");
    const sidebarElementNotifications = screen.getByText("Notifications");
    const sidebarElementMessages = screen.getByText("Messages");
    const sidebarElementSettings = screen.getByText("Settings");
    expect(sidebarElementHome).toBeInTheDocument();
    expect(sidebarElementForYou).toBeInTheDocument();
    expect(sidebarElementEvents).toBeInTheDocument();
    expect(sidebarElementNotifications).toBeInTheDocument();
    expect(sidebarElementMessages).toBeInTheDocument();
    expect(sidebarElementSettings).toBeInTheDocument();

    // Assert that the settings modal is rendered when the settings button is clicked
    fireEvent.click(sidebarElementSettings);
    const settingsModalElement = screen.getByRole("settings-modal");
    expect(settingsModalElement).toBeInTheDocument();

    // Assert that the "dark" class is added to the document element when the dark mode toggle is clicked
    const darkModeToggleElement = screen.getByTestId("dark-mode-toggle");
    // first check what the current state of the dark mode toggle is
    const isDarkModeActive =
      document.documentElement.classList.contains("dark");
    expect(isDarkModeActive).toBe(false);
    // then click the toggle and check again
    fireEvent.click(darkModeToggleElement);
    const isDarkModeActive2 =
      document.documentElement.classList.contains("dark");
    expect(isDarkModeActive2).toBe(true);

    // Assert that the settings modal is closed when the done button is clicked
    const closeButtonElement = screen.getByTestId("done-button");
    fireEvent.click(closeButtonElement);
    expect(settingsModalElement).not.toBeInTheDocument();

    // Assert that the feed was rendered
    const feedElement = screen.getByRole("feed");
    expect(feedElement).toBeInTheDocument();

    // the posts are being fetched asynchronously, so we need to wait for them to be rendered
    const postElements = await screen.findAllByTestId("post");
    expect(postElements.length).toBeGreaterThan(0);

    // Assert that the widgets were rendered
    const widgetsElement = screen.getByRole("widgets");
    expect(widgetsElement).toBeInTheDocument();

    // Assert that the trending posts were rendered
    const trendingPostsElements = await screen.findAllByTestId("trending-post");
    expect(trendingPostsElements.length).toBeGreaterThan(0);
  });

  it("renders the Home Component with a feed type", async () => {
    const searchParams = {
      feed: "art",
    };

    render(
      <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
        {await Home({ searchParams })}
      </RecoilRoot>
    );

    // Wait for the asynchronous data fetching to complete
    await screen.findByRole("main");


  });

  it("renders the Home Component with a failed fetch", async () => {
    // Mock a failed fetch request
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.reject(
            new Error("An error occurred while fetching the data")
          ),
      } as Response)
    );

    // screen.debug(undefined, Infinity);

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(
        <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
          {await Home({ searchParams })}
        </RecoilRoot>
      );
    });

    // Assert that the trending posts were not rendered
    const trendingPostsElementsUndefined =
      screen.queryAllByTestId("trending-post");
    expect(trendingPostsElementsUndefined.length).toBe(0);
    // screen.debug(undefined, Infinity);

    // // reset the backend url
    // process.env.NEXT_PUBLIC_BACKEND_URL = "http://localhost:3000/api";

    // reset the above mock
    jest.spyOn(global, "fetch").mockRestore();
  });

});




describe("Home Component User not authenticated", () => {
  it("renders the Home Component when the user is not signed in", async () => {
    // Mock the useSession hook to return an unauthenticated user
    useSession.mockReturnValue({
      status: "unauthenticated",
      data: null,
    });

    render(
      <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
        {await Home({searchParams})}
      </RecoilRoot>
    );
    // Wait for the asynchronous data fetching to complete
    await screen.findByRole("main");

    // Assert that the main role exists in the component
    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeInTheDocument();

    // Assert that the sidebar was rendered with the sign in button
    const sidebarElementSignIn = screen.getByText("Sign in");
    expect(sidebarElementSignIn).toBeInTheDocument();

    // Assert that the feed was rendered
    const feedElement = screen.getByRole("feed");
    expect(feedElement).toBeInTheDocument();
    const postElements = await screen.findAllByTestId("post");
    expect(postElements.length).toBeGreaterThan(0);

    // Assert that the delete post button was not rendered
    const deletePostButton = screen.queryByTestId("post-delete-button");
    expect(deletePostButton).not.toBeInTheDocument();

    // the input container should not be rendered inside the feed
    const inputContainer = screen.queryByTestId("input-container");
    expect(inputContainer).not.toBeInTheDocument();
  });
});

describe("Home Component User authenticated", () => {
  it("renders the Home Component when the user is signed in", async () => {
    // Mock the useSession hook to return a signed in user
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
        {await Home({searchParams})}
      </RecoilRoot>
    );
    // Wait for the asynchronous data fetching to complete
    await screen.findByRole("main");

    // Assert that the main role exists in the component
    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeInTheDocument();

    // the user was mocked to be authenticated, so the sidebar should be rendered with an express button,
    //the sign out button and the user's info

    // Assert that the express button was rendered
    const expressButton = screen.getByText("Express");
    expect(expressButton).toBeInTheDocument();

    // Assert that a modal is rendered when the express button is clicked
    fireEvent.click(expressButton);
    const modalElement = screen.getByRole("post-modal");
    expect(modalElement).toBeInTheDocument();

    // Assert that the user's image, name and email were rendered
    const userInfo = screen.getByTestId("user-info");
    expect(userInfo).toBeInTheDocument();

    // Assert that the sign out button was rendered
    const signOutButton = screen.getByText("Sign out");
    expect(signOutButton).toBeInTheDocument();

    // input container should be rendered inside the feed
    const inputContainer = screen.queryAllByTestId("input-container");
    expect(inputContainer.length).toBeGreaterThan(0);

    // Assert that the posts were rendered
    const postElements = await screen.findAllByTestId("post");
    expect(postElements.length).toBeGreaterThan(0);

    // Assert that the delete post button was rendered
    const deletePostButton = screen.queryByTestId("post-delete-button");
    expect(deletePostButton).toBeInTheDocument();
  });
});
