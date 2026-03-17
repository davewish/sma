import { useEffect, useState } from "react";
import { useAuth } from "@/hooks";
import { Calendar } from "@/components/features/Calendar";
import { PostMetrics } from "@/components/features/PostMetrics";
import { dashboardService } from "@/services/api/dashboard.service";
import { socialService } from "@/services/api/social.service";
import type {
  ConnectedAccount,
  ScheduledPost,
  DashboardStats,
} from "@/types/dashboard.types";
import "@/styles/dashboard.css";

export function DashboardPage(): React.ReactElement {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
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

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Loading dashboard data...");
      const [statsData, accountsData, postsData] = await Promise.all([
        dashboardService.getDashboardStats(),
        socialService.getConnectedAccounts(),
        dashboardService.getUpcomingPosts(),
      ]);

      console.log("Stats data:", statsData);
      console.log("Accounts data:", accountsData);
      console.log("Posts data:", postsData);

      setStats(statsData);
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
      // postsData is now guaranteed to be an array from the service
      setPosts(postsData);
      console.log("Posts set to state:", postsData.length, "posts");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load dashboard data";

      console.error("Dashboard load error:", err);

      // Check if it's a token expiration error using the helper
      if (isTokenExpired(err)) {
        console.log("Token expired detected in loadDashboardData, logging out");
        await logout();
        return;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
      {/* Header - Simplified */}
      <div className="dashboard-header-simple">
        <h1>Dashboard</h1>
        <p className="welcome">Welcome back, {user?.name}!</p>
      </div>

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
        {/* Main Area - Full Width */}
        <main className="dashboard-main-full">
          <PostMetrics posts={posts} />

          <Calendar
            posts={posts}
            onPostClick={() => {
              // Handle post click if needed
            }}
            onDateSelect={(date) => {
              console.log("Selected date:", date);
            }}
          />
        </main>
      </div>
    </div>
  );
}
