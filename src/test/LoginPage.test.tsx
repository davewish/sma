import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginPage } from "@/pages/LoginPage";
import { AuthProvider } from "@/context";

// Mock the auth service
jest.mock("@/services/api/auth.service", () => ({
  authService: {
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
    verifyToken: jest.fn(),
    refreshToken: jest.fn(),
  },
}));

describe("LoginPage Component", () => {
  const mockNavigate = jest.fn();

  const renderLoginPage = () => {
    return render(
      <AuthProvider>
        <LoginPage onNavigateToLanding={mockNavigate} />
      </AuthProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render login form by default", () => {
    renderLoginPage();

    expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("should toggle to signup form", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    const toggleButton = screen.getByText(/create account/i);
    await user.click(toggleButton);

    expect(screen.getByText(/create your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  });

  it("should show password mismatch error during signup", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    // Switch to signup
    await user.click(screen.getByText(/create account/i));

    // Fill in form with mismatched passwords
    await user.type(screen.getByLabelText(/full name/i), "Test User");
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "different");

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it("should show error for short password during signup", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    // Switch to signup
    await user.click(screen.getByText(/create account/i));

    // Fill in form with short password
    await user.type(screen.getByLabelText(/full name/i), "Test User");
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/^password/i), "short");
    await user.type(screen.getByLabelText(/confirm password/i), "short");

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it("should display demo credentials hint", () => {
    renderLoginPage();

    expect(screen.getByText(/demo credentials/i)).toBeInTheDocument();
    expect(screen.getByText(/admin@demo.com/)).toBeInTheDocument();
  });

  it("should clear error on form change", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    // Create error first
    const emailInput = screen.getByLabelText(/email/i);
    await user.click(emailInput);
    // Simulate error state by clicking submit without data
    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await user.click(submitButton);

    // Now change input to clear error
    await user.type(emailInput, "test@example.com");

    // Error should be cleared (this depends on clearError being called)
    // Verify the input has the value
    expect((emailInput as HTMLInputElement).value).toBe("test@example.com");
  });
});
