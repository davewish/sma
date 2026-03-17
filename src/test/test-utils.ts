import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  initialRoute?: string;
}

/**
 * Custom render function that includes common providers
 */
export function renderWithProviders(
  ui: ReactElement,
  { initialRoute = "/", ...renderOptions }: CustomRenderOptions = {},
) {
  window.history.pushState({}, "Test page", initialRoute);

  return render(ui, { ...renderOptions });
}

/**
 * Mock API response helper
 */
export function createMockApiResponse<T>(data: T, status = 200) {
  return {
    data,
    status,
    statusText: "OK",
    headers: {},
    config: {},
  };
}

/**
 * Mock error helper
 */
export function createMockApiError(
  message: string,
  status = 400,
  code = "API_ERROR",
) {
  const error = new Error(message);
  return {
    code,
    message,
    status,
    originalError: error,
  };
}

/**
 * Wait for async operations
 */
export async function waitForAsync() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

export * from "@testing-library/react";
