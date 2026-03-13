/**
 * Post Metrics Component
 * Displays engagement metrics (likes, comments, shares) for posts
 */

import type { ScheduledPost } from "@/types/dashboard.types";
import "@/styles/components/post-metrics.css";

interface PostMetricsProps {
  posts: ScheduledPost[];
}

export function PostMetrics({ posts }: PostMetricsProps): React.ReactElement {
  const publishedPosts = posts.filter((post) => post.status === "published");

  if (publishedPosts.length === 0) {
    return (
      <div className="post-metrics">
        <div className="metrics-header">
          <h2 className="metrics-title">Recent Post Metrics</h2>
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
        <h2 className="metrics-title">Recent Post Metrics</h2>
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
