import "@testing-library/jest-dom/vitest";
import ResizeObserver from "resize-observer-polyfill";
global.ResizeObserver = ResizeObserver;
import { server } from "./mocks/server";
import { PropsWithChildren } from "react";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

/**
 * - @highlight when we do mocking/mock of an library or a function then it means that we are now replacing all export from that library with the mock functions, meanwhile the Components provided by the library are also replaced with functions so now we can not use them as Components means nothing will render in the DOM, to solve this, will customise this module that how this module should be mocked,
 * - here the point is that if in future if we have to custimize any mock function then we have to write all the exports that are being used in the project.
 * - at the begining of writing the test it was like ==> mentioned below
 * -  @highlight vi.mock("@auth0/auth0-react"); // this was simple mocking initially.
 * - but we have to customize the Components as an Component because mocking means  @highlight replacing all exports with functions but we want components as an component, which we have used in react router, so we will do something like that====
    Auth0Provider: ({ children }: PropsWithChildren) => children,
    withAuthenticationRequired: vi.fn(),
 */
// vi.mock("@auth0/auth0-react");
vi.mock("@auth0/auth0-react", () => {
  return {
    useAuth0: vi.fn().mockReturnValue({
      isAuthenticated: false,
      user: undefined,
      isLoading: false,
    }),
    // Auth0Provider: vi,fn() // it was initially like that when we had mocked this library, but we want to customize this as an component because it is an component which we have used in react router, so we will do something like that====
    Auth0Provider: ({ children }: PropsWithChildren) => children,
    withAuthenticationRequired: vi.fn(),
  };
});

window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
