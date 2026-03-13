/**
 * Connected Accounts Component
 */

import type { ConnectedAccount } from "@/types/dashboard.types";
import "@/styles/components/connected-accounts.css";

interface ConnectedAccountsProps {
  accounts: ConnectedAccount[];
  onConnect: (platform: string) => void;
  onDisconnect: (accountId: string) => void;
}

const platformEmojis: Record<string, string> = {
  instagram: "📷",
  facebook: "📘",
  tiktok: "🎵",
};

const platformColors: Record<string, string> = {
  instagram: "#E4405F",
  facebook: "#1877F2",
  tiktok: "#000000",
};

export function ConnectedAccountsComponent({
  accounts,
  onConnect,
  onDisconnect,
}: ConnectedAccountsProps) {
  const allPlatforms: Array<"instagram" | "facebook" | "tiktok"> = [
    "instagram",
    "facebook",
    "tiktok",
  ];
  const connectedPlatforms = accounts.map((acc) => acc.platform);
  const availablePlatforms = allPlatforms.filter(
    (p) => !connectedPlatforms.includes(p),
  );

  return (
    <div className="connected-accounts">
      <h2>Connected Accounts</h2>

      {accounts.length === 0 ? (
        <p className="no-accounts">No accounts connected yet</p>
      ) : (
        <div className="accounts-grid">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="account-card"
              style={{
                borderLeftColor: platformColors[account.platform],
              }}
            >
              <div className="account-header">
                <span className="platform-icon">
                  {platformEmojis[account.platform]}
                </span>
                <span className="platform-name">
                  {account.platform.charAt(0).toUpperCase() +
                    account.platform.slice(1)}
                </span>
              </div>
              <p className="username">@{account.username}</p>
              <p className="followers">
                {account.followers.toLocaleString()} followers
              </p>
              <button
                className="disconnect-btn"
                onClick={() => onDisconnect(account.id)}
              >
                Disconnect
              </button>
            </div>
          ))}
        </div>
      )}

      {availablePlatforms.length > 0 && (
        <div className="connect-section">
          <h3>Connect More Accounts</h3>
          <div className="connect-buttons">
            {availablePlatforms.map((platform) => (
              <button
                key={platform}
                className="connect-btn"
                style={{
                  borderColor: platformColors[platform],
                  color: platformColors[platform],
                }}
                onClick={() => onConnect(platform)}
              >
                <span className="icon">
                  {platformEmojis[platform as keyof typeof platformEmojis]}
                </span>
                Connect {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
