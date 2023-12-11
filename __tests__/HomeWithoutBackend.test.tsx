import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { postModalState } from "@/app/atom/modalAtom";

jest.mock("@/app/utils/config/backendUrl", () => {
  return {
    __esModule: true,
    default: undefined,
  };
});

import Home from '@/app/page';


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


describe("Home Component without backendUrl", () => {
  it("renders the Home Component without the backendUrl", async () => {

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

    // Assert that the feed was rendered
    const feedElement = screen.getByRole("feed");
    expect(feedElement).toBeInTheDocument();

    // Assert that the widgets were rendered
    const widgetsElement = screen.getByRole("widgets");
    expect(widgetsElement).toBeInTheDocument();
  });
});