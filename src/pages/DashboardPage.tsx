/**
 * Dashboard Page
 */

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks";
import { ConnectedAccountsComponent } from "@/components/features/ConnectedAccounts";
import { Calendar } from "@/components/features/Calendar";
import { Button } from "@/components/common";
import { dashboardService } from "@/services/api/dashboard.service";
import type {
  ConnectedAccount,
  ScheduledPost,
  DashboardStats,
} from "@/types/dashboard.types";
import "@/styles/dashboard.css";

interface DashboardPageProps {
  onNavigateToLanding?: () => void;
}

export function DashboardPage({ onNavigateToLanding }: DashboardPageProps) {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsData, accountsData, postsData] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getConnectedAccounts(),
        dashboardService.getUpcomingPosts(),
      ]);

      setStats(statsData);
      setAccounts(accountsData);
      setPosts(postsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard data",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (platform: string) => {
    // TODO: Implement OAuth flow for platform
    console.log(`Connecting ${platform}...`);
    alert(`${platform} OAuth flow would be initiated here`);
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      await dashboardService.disconnectAccount(accountId);
      setAccounts(accounts.filter((acc) => acc.id !== accountId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to disconnect account",
      );
    }
  };

  const handleLogout = () => {
    logout();
    onNavigateToLanding?.();
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Dashboard</h1>
          <p className="welcome">Welcome back, {user?.name}!</p>
        </div>
        <div className="header-right">
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {/* Stats Section */}
      {stats && (
        <section className="stats-section">
          <div className="stat-card">
            <h3>Total Followers</h3>
            <p className="stat-value">
              {stats.totalFollowers.toLocaleString()}
            </p>
          </div>
          <div className="stat-card">
            <h3>Posts This Month</h3>
            <p className="stat-value">{stats.postsThisMonth}</p>
          </div>
          <div className="stat-card">
            <h3>Engagement Rate</h3>
            <p className="stat-value">{stats.engagementRate.toFixed(2)}%</p>
          </div>
          <div className="stat-card">
            <h3>Connected Accounts</h3>
            <p className="stat-value">{accounts.length}</p>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <ConnectedAccountsComponent
            accounts={accounts}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        </aside>

        {/* Main Area */}
        <main className="dashboard-main">
          <Calendar
            posts={posts}
            onPostClick={setSelectedPost}
            onDateSelect={(date) => {
              console.log("Selected date:", date);
            }}
          />

          {selectedPost && (
            <div className="selected-post">
              <h3>Post Details</h3>
              <div className="post-content">
                <p>
                  <strong>Platform:</strong>{" "}
                  {selectedPost.platform.toUpperCase()}
                </p>
                <p>
                  <strong>Scheduled:</strong>{" "}
                  {new Date(selectedPost.scheduledTime).toLocaleString()}
                </p>
                <p>
                  <strong>Content:</strong> {selectedPost.content}
                </p>
                {selectedPost.engagement && (
                  <>
                    <p>
                      <strong>Likes:</strong> {selectedPost.engagement.likes}
                    </p>
                    <p>
                      <strong>Comments:</strong>{" "}
                      {selectedPost.engagement.comments}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
