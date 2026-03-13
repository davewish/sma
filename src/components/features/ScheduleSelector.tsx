/**
 * Schedule & Account Selector Component
 */

import { useState } from "react";
import type { ConnectedAccount } from "@/types/dashboard.types";
import "@/styles/components/schedule-selector.css";

interface ScheduleSelectorProps {
  accounts: ConnectedAccount[];
  scheduledTime: string;
  selectedAccounts: string[];
  onScheduleChange: (time: string) => void;
  onAccountToggle: (accountId: string) => void;
}

export function ScheduleSelector({
  accounts,
  scheduledTime,
  selectedAccounts,
  onScheduleChange,
  onAccountToggle,
}: ScheduleSelectorProps) {
  const [scheduleType, setScheduleType] = useState<"now" | "later">(
    scheduledTime ? "later" : "now",
  );

  const getTodayMin = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15); // Minimum 15 minutes from now
    return now.toISOString().slice(0, 16);
  };

  const getMaxDate = () => {
    const max = new Date();
    max.setDate(max.getDate() + 365); // Max 1 year from now
    return max.toISOString().slice(0, 16);
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      instagram: "#E4405F",
      facebook: "#1877F2",
      tiktok: "#000000",
    };
    return colors[platform] || "#667eea";
  };

  const platformEmojis: Record<string, string> = {
    instagram: "📷",
    facebook: "📘",
    tiktok: "🎵",
  };

  return (
    <div className="schedule-selector">
      <h3>Schedule & Target</h3>

      <div className="schedule-section">
        <label>When to Post?</label>
        <div className="schedule-type-buttons">
          <button
            type="button"
            className={`schedule-type-btn ${scheduleType === "now" ? "active" : ""}`}
            onClick={() => {
              setScheduleType("now");
              onScheduleChange("");
            }}
          >
            Post Now
          </button>
          <button
            type="button"
            className={`schedule-type-btn ${scheduleType === "later" ? "active" : ""}`}
            onClick={() => setScheduleType("later")}
          >
            Schedule for Later
          </button>
        </div>

        {scheduleType === "later" && (
          <div className="schedule-input-container">
            <label htmlFor="schedule-time">Select Date & Time</label>
            <input
              id="schedule-time"
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => onScheduleChange(e.target.value)}
              min={getTodayMin()}
              max={getMaxDate()}
              className="schedule-input"
              required
            />
            {scheduledTime && (
              <p className="scheduled-preview">
                📅 Scheduled for: {new Date(scheduledTime).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="accounts-section">
        <label>Select Accounts to Post</label>
        <p className="accounts-hint">
          Choose which accounts this post will be published to
        </p>

        {accounts.length === 0 ? (
          <div className="no-accounts-message">
            <p>No connected accounts</p>
            <p className="small-text">
              Connect social media accounts first to schedule posts
            </p>
          </div>
        ) : (
          <div className="accounts-list">
            {accounts.map((account) => (
              <label key={account.id} className="account-checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedAccounts.includes(account.id)}
                  onChange={() => onAccountToggle(account.id)}
                  className="account-checkbox"
                />
                <div className="account-info">
                  <span className="account-icon">
                    {platformEmojis[account.platform]}
                  </span>
                  <div className="account-details">
                    <span className="account-name">
                      {account.platform.charAt(0).toUpperCase() +
                        account.platform.slice(1)}
                    </span>
                    <span className="account-username">
                      @{account.username}
                    </span>
                  </div>
                  <span
                    className="account-followers"
                    style={{
                      borderLeftColor: getPlatformColor(account.platform),
                    }}
                  >
                    {account.followers.toLocaleString()} followers
                  </span>
                </div>
              </label>
            ))}
          </div>
        )}

        {selectedAccounts.length === 0 && accounts.length > 0 && (
          <p className="warning-text">
            ⚠️ Please select at least one account to publish
          </p>
        )}
      </div>
    </div>
  );
}
