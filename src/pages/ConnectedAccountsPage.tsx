import { useEffect, useState } from "react";
import { useAuth } from "@/hooks";
import { ConnectedAccountsComponent } from "@/components/features/ConnectedAccounts";
import { socialService } from "@/services/api/social.service";
import type { ConnectedAccount } from "@/types/dashboard.types";
import type { OAuthProvider } from "@/types/oauth.types";
import "@/styles/connected-accounts.css";

export function ConnectedAccountsPage(): React.ReactElement {
  const { logout } = useAuth();
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);

  // Helper to check if error is token expiration
  const isTokenExpired = (err: unknown): boolean => {
    const message = err instanceof Error ? err.message : String(err);
    return (
      message.includes("TOKEN_EXPIRED") ||
      message.includes("Invalid") ||
      message.includes("expired") ||
      message.includes("Session expired")
    );
  };

  const loadAccounts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const accountsData = await socialService.getConnectedAccounts();
      // Convert social accounts to ConnectedAccount format (filter out twitter)
      const connectedAccounts: ConnectedAccount[] = accountsData
        .filter((acc) => acc.platform !== "twitter")
        .map((acc) => ({
          id: acc._id || acc.accountId || `${acc.platform}-${Date.now()}`,
          platform: acc.platform as "instagram" | "facebook" | "tiktok",
          username: acc.accountName,
          // Use followers directly if available, otherwise check profileData
          followers: acc.followers || acc.profileData?.followers || 0,
          isConnected: true,
          connectedAt: acc.connectedAt,
        }));
      setAccounts(connectedAccounts);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load accounts";

      // Check if it's a token expiration error
      if (isTokenExpired(err)) {
        console.log(
          "Token expired detected in ConnectedAccountsPage, logging out",
        );
        await logout();
        return;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();

    // Check for OAuth callback - if user is returning from OAuth
    const params = new URLSearchParams(window.location.search);
    const successParam = params.get("success");
    const errorParam = params.get("error");

    if (successParam === "true") {
      console.log("OAuth callback detected - reloading accounts");
      setError(null);
      // Clear the URL params
      window.history.replaceState({}, document.title, window.location.pathname);
      // Reload accounts after a short delay to ensure backend has saved
      setTimeout(() => {
        loadAccounts();
      }, 500);
    } else if (errorParam) {
      console.error("OAuth error:", errorParam);
      setError(`Failed to connect account: ${errorParam}`);
      // Clear the URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnect = async (platform: OAuthProvider) => {
    try {
      console.log(`Initiating OAuth flow for ${platform}...`);
      // Call the OAuth endpoint through API client (automatically includes auth headers)
      // The backend will redirect to Facebook OAuth
      await socialService.initiateOAuthConnection(platform);
    } catch (error) {
      console.error(`Failed to connect ${platform}:`, error);
      setError(`Failed to initiate ${platform} connection`);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      setDisconnectingId(accountId);
      // Find the account to get its platform
      const account = accounts.find((acc) => acc.id === accountId);
      if (!account) {
        setError("Account not found");
        setDisconnectingId(null);
        return;
      }

      console.log(`Disconnecting ${account.platform}...`);
      await socialService.disconnectAccount(account.platform);
      console.log(`Successfully disconnected ${account.platform}`);
      setAccounts(accounts.filter((acc) => acc.id !== accountId));
      setDisconnectingId(null);
    } catch (err) {
      setDisconnectingId(null);
      // Check if it's a token expiration error
      if (isTokenExpired(err)) {
        console.log("Token expired detected in handleDisconnect, logging out");
        await logout();
        return;
      }

      const errorMessage =
        err instanceof Error ? err.message : "Failed to disconnect account";
      console.error("Disconnect error:", errorMessage);
      setError(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="connected-accounts-page">
        <h1>Connected Accounts</h1>
        <div className="loading">Loading accounts...</div>
      </div>
    );
  }

  return (
    <div className="connected-accounts-page">
      <div className="accounts-header">
        <h1>Connected Accounts</h1>
        <p className="accounts-description">
          Manage your connected social media accounts and view their performance
        </p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <ConnectedAccountsComponent
        accounts={accounts}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        disconnectingId={disconnectingId}
      />
    </div>
  );
}
