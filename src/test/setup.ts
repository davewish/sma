import "@testing-library/jest-dom";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.location for OAuth tests
const mockLocation = {
  href: "",
  hash: "",
  host: "localhost",
  hostname: "localhost",
  pathname: "/",
  port: "",
  protocol: "http:",
  search: "",
  assign: jest.fn(),
  reload: jest.fn(),
  replace: jest.fn(),
  toString: () => "http://localhost/",
};

Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
});

// Suppress console errors for expected test errors
const originalError = console.error;
beforeEach(() => {
  console.error = jest.fn();
});

afterEach(() => {
  console.error = originalError;
  jest.clearAllMocks();
});
