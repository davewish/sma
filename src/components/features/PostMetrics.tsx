/**
 * Post Metrics Component
 * Displays engagement metrics (likes, comments, shares) for posts
 */

import { useState } from "react";
import type { ScheduledPost } from "@/types/dashboard.types";
import "@/styles/components/post-metrics.css";

interface PostMetricsProps {
  posts: ScheduledPost[];
}

type TimePeriod = 7 | 14 | 30;

export function PostMetrics({ posts }: PostMetricsProps): React.ReactElement {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(7);

  const getPostsForPeriod = (days: TimePeriod): ScheduledPost[] => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return posts.filter((post) => {
      if (post.status !== "published") return false;
      const postDate = new Date(post.scheduledTime);
      return postDate >= cutoffDate;
    });
  };

  const publishedPosts = getPostsForPeriod(selectedPeriod);

  if (posts.filter((p) => p.status === "published").length === 0) {
    return (
      <div className="post-metrics">
        <div className="metrics-header">
          <h2 className="metrics-title">Post Engagement Metrics</h2>
        </div>
        <div className="no-metrics-message">
          <p>No published posts yet</p>
          <p className="small-text">
            Published posts will display engagement metrics here
          </p>
        </div>
      </div>
    );
  }

  const totalLikes = publishedPosts.reduce(
    (sum, post) => sum + (post.engagement?.likes || 0),
    0,
  );
  const totalComments = publishedPosts.reduce(
    (sum, post) => sum + (post.engagement?.comments || 0),
    0,
  );
  const totalShares = publishedPosts.reduce(
    (sum, post) => sum + (post.engagement?.shares || 0),
    0,
  );

  const platformEmojis: Record<string, string> = {
    instagram: "📷",
    facebook: "📘",
    tiktok: "🎵",
  };

  return (
    <div className="post-metrics">
      <div className="metrics-header">
        <h2 className="metrics-title">Post Engagement Metrics</h2>
        <div className="metrics-time-filter">
          <button
            className={`time-filter-btn ${selectedPeriod === 7 ? "active" : ""}`}
            onClick={() => setSelectedPeriod(7)}
          >
            Last 7 Days
          </button>
          <button
            className={`time-filter-btn ${selectedPeriod === 14 ? "active" : ""}`}
            onClick={() => setSelectedPeriod(14)}
          >
            Last 14 Days
          </button>
          <button
            className={`time-filter-btn ${selectedPeriod === 30 ? "active" : ""}`}
            onClick={() => setSelectedPeriod(30)}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      <div className="metrics-period-info">
        <span className="period-label">Showing last {selectedPeriod} days</span>
        <span className="metrics-count">{publishedPosts.length} posts</span>
      </div>

      <div className="metrics-summary">
        <div className="metric-card">
          <div className="metric-icon">❤️</div>
          <div className="metric-info">
            <p className="metric-label">Total Likes</p>
            <p className="metric-value">{totalLikes.toLocaleString()}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">💬</div>
          <div className="metric-info">
            <p className="metric-label">Total Comments</p>
            <p className="metric-value">{totalComments.toLocaleString()}</p>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">↗️</div>
          <div className="metric-info">
            <p className="metric-label">Total Shares</p>
            <p className="metric-value">{totalShares.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="posts-list">
        <h3 className="posts-list-title">Individual Post Performance</h3>
        <div className="posts-grid">
          {publishedPosts.map((post) => (
            <div key={post.id} className="post-item">
              <div className="post-header">
                <span className="platform-badge">
                  {platformEmojis[post.platform]}
                  {post.platform.charAt(0).toUpperCase() +
                    post.platform.slice(1)}
                </span>
                <span className="post-date">
                  {new Date(post.scheduledTime).toLocaleDateString()}
                </span>
              </div>

              <p className="post-preview">{post.content.substring(0, 60)}...</p>

              <div className="post-metrics-row">
                <div className="post-metric">
                  <span className="metric-icon-small">❤️</span>
                  <span className="metric-value-small">
                    {post.engagement?.likes || 0}
                  </span>
                </div>
                <div className="post-metric">
                  <span className="metric-icon-small">💬</span>
                  <span className="metric-value-small">
                    {post.engagement?.comments || 0}
                  </span>
                </div>
                <div className="post-metric">
                  <span className="metric-icon-small">↗️</span>
                  <span className="metric-value-small">
                    {post.engagement?.shares || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
