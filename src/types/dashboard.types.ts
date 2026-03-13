/**
 * Dashboard types
 */

export interface ConnectedAccount {
  id: string;
  platform: "instagram" | "facebook" | "tiktok";
  username: string;
  followers: number;
  isConnected: boolean;
  connectedAt?: string;
}

export interface ScheduledPost {
  id: string;
  accountId: string;
  platform: "instagram" | "facebook" | "tiktok";
  content: string;
  image?: string;
  scheduledTime: string;
  status: "draft" | "scheduled" | "published";
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
}

export interface DashboardStats {
  totalFollowers: number;
  postsThisMonth: number;
  engagementRate: number;
  accounts: ConnectedAccount[];
  upcomingPosts: ScheduledPost[];
}
