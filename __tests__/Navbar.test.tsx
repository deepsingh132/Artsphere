import { act, fireEvent, render, screen } from "@testing-library/react";

const useRouter = jest.spyOn(require("next/navigation"), "useRouter");
const usePathname = jest.spyOn(require("next/navigation"), "usePathname");

usePathname.mockReturnValue("/");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

import Navbar from "@/components/Navbar";
import React from "react";

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

const useSession = jest.spyOn(require("next-auth/react"), "useSession");

describe("Navbar for unauthenticated user", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSession.mockReturnValue({
      status: "unauthenticated",
      data: null,
    });
  });

  it("should render the navbar with a title and back button", () => {
    const mockBack = jest.fn();
    useRouter.mockReturnValue({
      back: mockBack,
    });

    usePathname.mockReturnValueOnce("/test");
    render(<Navbar title="test" />);
    expect(screen.getByText("test")).toBeInTheDocument();
    const backButton = screen.getByTestId("back-btn");
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);
    expect(mockBack).toHaveBeenCalled();
  });

  it("should render the navbar without a title", () => {
    render(<Navbar title={undefined} />);
    const navbarItems = screen.getAllByTestId("navbar-item");
    expect(navbarItems).toHaveLength(4);
  });

  it("should not render the profile photo", () => {
    render(<Navbar title={undefined} />);
    expect(screen.queryByTestId("navbarPfp")).not.toBeInTheDocument();
  });
});

describe("Navbar for authenticated user", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSession.mockReturnValue({
      status: "authenticated",
      data: {
        user: {
          id: "12345",
          email: "test@example.com",
          image: "https://img.logoipsum.com/226.svg",
          name: "Test User",
          accessToken: "example-access-token",
        },
      },
    });
  });

  it("should render the navbar with a title and back button", async () => {
    const mockBack = jest.fn();
    useRouter.mockReturnValue({
      back: mockBack,
    });

    usePathname.mockReturnValueOnce("/test");
    render(<Navbar title="test" />);
    await screen.findByTestId("navbar");
    expect(screen.getByText("test")).toBeInTheDocument();
    const backButton = screen.getByTestId("back-btn");
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);
    expect(mockBack).toHaveBeenCalled();
  });

  it("should render the navbar without a title", async () => {

    render(<Navbar title={undefined} />);
    const navbar = screen.getByTestId("navbar");
    expect(navbar).toBeInTheDocument();

    // Assert that the navbar has the correct number of items
    const navbarItems = screen.getAllByTestId("navbar-item");
    expect(navbarItems).toHaveLength(4);

    // Assert that the navbar items are in the correct order
    expect(navbarItems[0]).toHaveTextContent("Music");
    expect(navbarItems[1]).toHaveTextContent("Art");
    expect(navbarItems[2]).toHaveTextContent("Film");
    expect(navbarItems[3]).toHaveTextContent("Literature");

  });

  it("should test the navbar items", async () => {
    const mockReplace = jest.fn();
    useRouter.mockReturnValue({
      replace: mockReplace,
    });

    render(<Navbar title={undefined} />);
    const navbar = screen.getByTestId("navbar");
    expect(navbar).toBeInTheDocument();

    // Assert that the navbar has the correct number of items
    const navbarItems = screen.getAllByTestId("navbar-item");
    expect(navbarItems).toHaveLength(4);

    // Assert that the navbar items are in the correct order
    expect(navbarItems[0]).toHaveTextContent("Music");
    expect(navbarItems[1]).toHaveTextContent("Art");
    expect(navbarItems[2]).toHaveTextContent("Film");
    expect(navbarItems[3]).toHaveTextContent("Literature");

    // Assert that the navbar items have the correct onClick handlers
    fireEvent.click(navbarItems[0]);
    expect(mockReplace).toHaveBeenCalled();

    fireEvent.click(navbarItems[1]);
    expect(mockReplace).toHaveBeenCalled();

    fireEvent.click(navbarItems[2]);
    expect(mockReplace).toHaveBeenCalled();

    fireEvent.click(navbarItems[3]);
    expect(mockReplace).toHaveBeenCalled();

  });

  it("should render the profile photo", () => {
    render(<Navbar title={undefined} />);

    const navbar = screen.getByTestId("navbar");
    expect(navbar).toBeInTheDocument();
    const navbarMenuButton = screen.getByTestId("navbarPfp");
    expect(navbarMenuButton).toBeInTheDocument();

    fireEvent.click(navbarMenuButton);
    const closeNavbarButton = screen.getByTestId("close-navbar-btn");
    expect(closeNavbarButton).toBeInTheDocument();
    const sidebarMenu = screen.getByTestId("sidebar-menu");
    expect(sidebarMenu).toBeInTheDocument();

    // Click on the sidebar menu to check stopPropagation
    fireEvent.click(sidebarMenu);

    // Assert that the sidebar menu is visible
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("For You")).toBeInTheDocument();
    expect(screen.getByText("Events")).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("Messages")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();

    window.innerWidth = 1024;
    fireEvent(window, new Event("resize"));

    screen.debug(undefined, Infinity);
  });
});
