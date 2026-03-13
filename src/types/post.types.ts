/**
 * Post Creation Types
 */

export type MediaType = "image" | "video";

export interface PostMedia {
  file: File;
  type: MediaType;
  preview: string;
  size: number;
}

export interface PostHashtag {
  id: string;
  name: string;
  selected: boolean;
}

export interface SchedulePost {
  id?: string;
  caption: string;
  hashtags: string[];
  media: PostMedia | null;
  scheduledTime: string;
  selectedAccounts: string[];
  status: "draft" | "scheduled" | "published";
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostFormData {
  caption: string;
  hashtags: string[];
  media: PostMedia | null;
  scheduledTime: string;
  selectedAccounts: string[];
}
