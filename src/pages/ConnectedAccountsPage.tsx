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
        console.log("Token expired detected in ConnectedAccountsPage, logging out");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnect = async (platform: OAuthProvider) => {
    try {
      // In production, the OAuth callback would add the account
      // For now, we just show a message
      console.log(`OAuth flow initiated for ${platform}`);
      // The actual account addition would happen after OAuth callback
    } catch (error) {
      console.error(`Failed to connect ${platform}:`, error);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      await socialService.disconnectAccount(accountId);
      setAccounts(accounts.filter((acc) => acc.id !== accountId));
    } catch (err) {
      // Check if it's a token expiration error
      if (isTokenExpired(err)) {
        console.log("Token expired detected in handleDisconnect, logging out");
        await logout();
        return;
      }

      const errorMessage =
        err instanceof Error ? err.message : "Failed to disconnect account";
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
      />
    </div>
  );
}
