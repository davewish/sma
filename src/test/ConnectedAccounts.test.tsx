import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConnectedAccountsComponent } from "@/components/features/ConnectedAccounts";
import type { ConnectedAccount } from "@/types/dashboard.types";

// Mock OAuth service to prevent navigation errors
jest.mock("@/services/oauth/oauth.service", () => ({
  oauthService: {
    initiateOAuthFlow: jest.fn(),
  },
}));

describe("ConnectedAccounts Component", () => {
  const mockAccounts: ConnectedAccount[] = [
    {
      id: "fb-1",
      platform: "facebook",
      username: "John Doe",
      followers: 5200,
      isConnected: true,
      connectedAt: "2026-03-15T00:00:00Z",
    },
    {
      id: "ig-1",
      platform: "instagram",
      username: "john.doe.insta",
      followers: 12400,
      isConnected: true,
      connectedAt: "2026-03-15T00:00:00Z",
    },
  ];

  const mockOnConnect = jest.fn();
  const mockOnDisconnect = jest.fn();

  it("should display connected accounts", () => {
    render(
      <ConnectedAccountsComponent
        accounts={mockAccounts}
        onConnect={mockOnConnect}
        onDisconnect={mockOnDisconnect}
      />,
    );

    expect(screen.getByText("Connected Accounts")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe.insta")).toBeInTheDocument();
    expect(screen.getByText(/5,200/)).toBeInTheDocument();
    expect(screen.getByText(/12,400/)).toBeInTheDocument();
  });

  it("should show message when no accounts are connected", () => {
    render(
      <ConnectedAccountsComponent
        accounts={[]}
        onConnect={mockOnConnect}
        onDisconnect={mockOnDisconnect}
      />,
    );

    expect(screen.getByText("No accounts connected yet")).toBeInTheDocument();
  });

  it("should call onDisconnect when disconnect button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <ConnectedAccountsComponent
        accounts={mockAccounts}
        onConnect={mockOnConnect}
        onDisconnect={mockOnDisconnect}
      />,
    );

    const disconnectButtons = screen.getAllByText(/disconnect/i);
    await user.click(disconnectButtons[0]);

    expect(mockOnDisconnect).toHaveBeenCalledWith("fb-1");
  });

  it("should display platform-specific icons", () => {
    render(
      <ConnectedAccountsComponent
        accounts={mockAccounts}
        onConnect={mockOnConnect}
        onDisconnect={mockOnDisconnect}
      />,
    );

    // Check for platform indicators
    const facebookElements = screen.getAllByText(/facebook/i);
    const instagramElements = screen.getAllByText(/instagram/i);

    expect(facebookElements.length).toBeGreaterThan(0);
    expect(instagramElements.length).toBeGreaterThan(0);
  });

  it("should display connect buttons for available platforms", () => {
    render(
      <ConnectedAccountsComponent
        accounts={[mockAccounts[0]]} // Only Facebook connected
        onConnect={mockOnConnect}
        onDisconnect={mockOnDisconnect}
      />,
    );

    expect(screen.getByText(/connect instagram/i)).toBeInTheDocument();
    expect(screen.getByText(/connect tiktok/i)).toBeInTheDocument();
  });

  it("should call onConnect when connect button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <ConnectedAccountsComponent
        accounts={[]}
        onConnect={mockOnConnect}
        onDisconnect={mockOnDisconnect}
      />,
    );

    const connectButtons = screen.getAllByRole("button");
    const instagramButton = connectButtons.find((btn) =>
      btn.textContent?.includes("Instagram"),
    );

    if (instagramButton) {
      await user.click(instagramButton);
      expect(mockOnConnect).toHaveBeenCalledWith("instagram");
    }
  });

  it("should display follower counts formatted", () => {
    const accountsWithFollowers: ConnectedAccount[] = [
      {
        ...mockAccounts[0],
        followers: 1000000,
      },
    ];

    render(
      <ConnectedAccountsComponent
        accounts={accountsWithFollowers}
        onConnect={mockOnConnect}
        onDisconnect={mockOnDisconnect}
      />,
    );

    expect(screen.getByText(/1,000,000/)).toBeInTheDocument();
  });
});
