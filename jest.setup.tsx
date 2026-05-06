/* eslint-disable */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

import "@testing-library/jest-dom";

// --- Mock next/image ---
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, fill, priority, sizes, ...rest }: any) => (
    <img src={src} alt={alt} {...rest} />
  ),
}));

// --- Mock next/navigation ---
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname() {
    return "/";
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// --- Mock next/link ---
jest.mock("next/link", () => {
  return function MockedLink({ children, href }: any) {
    return <a href={href}>{children}</a>;
  };
});



// --- ResizeObserver mock ---
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(global as any).ResizeObserver = ResizeObserverMock;

// --- Silence certains warnings React inutiles ---
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === "string" &&
    (args[0].includes("Warning: ReactDOM.render is no longer supported") ||
      args[0].includes("Warning: useLayoutEffect"))
  ) {
    return;
  }
  originalError.call(console, ...args);
};
