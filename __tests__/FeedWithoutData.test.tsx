import { act, fireEvent, render, screen } from "@testing-library/react";
import { RecoilRoot } from "recoil";

import Feed from "@/components/Feed";
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
  feed: undefined,
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

describe("Feed Component with failed fetch", () => {
  useSession.mockReturnValue({
      data: {
        user: {
          id: "1",
          name: "Test User",
          email: "test@email.com"
        },
      }
    });
  it("should render the Feed with a failed fetch for swr", async () => {
    // Mock a failed fetch request
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.reject(
            new Error("An error occurred while fetching the data")
          ),
      } as Response)
    );

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(
        <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
          <Feed type={searchParams.feed} />
        </RecoilRoot>
      );
    });

    const feed = screen.getByTestId("feed");
    expect(feed).toBeInTheDocument();

    // reset the above mock
    jest.spyOn(global, "fetch").mockRestore();
  });

  it("should render the Feed with no data", async () => {
    // Mock a fetch request that returns no data
    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({ posts: [] }),
      } as Response)
    );

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(
        <RecoilRoot initializeState={(snap) => snap.set(postModalState, false)}>
          <Feed type={searchParams.feed} />
        </RecoilRoot>
      );
    });

    const feed = screen.getByTestId("feed");
    expect(feed).toBeInTheDocument();

    // reset the above mock
    jest.spyOn(global, "fetch").mockRestore();
  });

});
