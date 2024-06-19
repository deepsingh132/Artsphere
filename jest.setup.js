import "@testing-library/jest-dom";
import "whatwg-fetch";
import { server } from "./__mocks__/server";

beforeAll(() => {
  // Disable error logs from jsdom css parsing error
  /**
   * This is a workaround for the following issue:
   * NOTE: The error message "Error: Could not parse CSS stylesheet" is thrown by jsdom when it tries to parse a CSS file that contains an unsupported CSS feature.
   * TODO: Remove this workaround once the issue is fixed in jsdom.
   */
  const originalConsoleError = console.error;
  const jsDomCssError = "Error: Could not parse CSS stylesheet";
  console.error = (...params) => {
    if (!params.find((p) => p.toString().includes(jsDomCssError))) {
      originalConsoleError(...params);
    }
  };

  server.listen();
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
