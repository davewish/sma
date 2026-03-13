import { useState } from "react";
import { MediaUpload } from "@/components/features/MediaUpload";
import { CaptionInput } from "@/components/features/CaptionInput";
import { ScheduleSelector } from "@/components/features/ScheduleSelector";
import type { PostMedia } from "@/types/post.types";
import type { ConnectedAccount } from "@/types/dashboard.types";
import "@/styles/create-post.css";

export default function CreatePostPage() {
  // Form state
  const [media, setMedia] = useState<PostMedia | null>(null);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Mock connected accounts
  const mockAccounts: ConnectedAccount[] = [
    {
      id: "fb-1",
      platform: "facebook",
      username: "mybrand",
      followers: 5200,
      isConnected: true,
    },
    {
      id: "ig-1",
      platform: "instagram",
      username: "mybrand.official",
      followers: 12400,
      isConnected: true,
    },
    {
      id: "tt-1",
      platform: "tiktok",
      username: "@mybrand",
      followers: 45600,
      isConnected: true,
    },
  ];

  const handleMediaSelect = (selectedMedia: PostMedia) => {
    setMedia(selectedMedia);
    setSubmitError(null);
  };

  const handleMediaRemove = () => {
    setMedia(null);
  };

  const handleCaptionChange = (newCaption: string) => {
    setCaption(newCaption);
    setSubmitError(null);
  };

  const handleHashtagAdd = (hashtag: string) => {
    if (!hashtags.includes(hashtag)) {
      setHashtags([...hashtags, hashtag]);
    }
  };

  const handleHashtagRemove = (hashtag: string) => {
    setHashtags(hashtags.filter((h) => h !== hashtag));
  };

  const handleScheduleChange = (time: string) => {
    setScheduledTime(time);
    setSubmitError(null);
  };

  const handleAccountToggle = (accountId: string) => {
    if (selectedAccountIds.includes(accountId)) {
      setSelectedAccountIds(
        selectedAccountIds.filter((id) => id !== accountId),
      );
    } else {
      setSelectedAccountIds([...selectedAccountIds, accountId]);
    }
    setSubmitError(null);
  };

  const validateForm = (): boolean => {
    if (!media) {
      setSubmitError("Please upload an image or video");
      return false;
    }

    if (!caption.trim()) {
      setSubmitError("Please write a caption");
      return false;
    }

    if (selectedAccountIds.length === 0) {
      setSubmitError("Please select at least one account to post to");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitSuccess(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        setMedia(null);
        setCaption("");
        setHashtags([]);
        setScheduledTime("");
        setSelectedAccountIds([]);
        setSubmitError(null);
      }, 2000);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to create post",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure? Any unsaved changes will be lost.")) {
      // Reset form
      setMedia(null);
      setCaption("");
      setHashtags([]);
      setScheduledTime("");
      setSelectedAccountIds([]);
      setSubmitError(null);
    }
  };

  if (submitSuccess) {
    return (
      <div className="create-post-page">
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h2 className="success-title">Post Created Successfully!</h2>
          <p className="success-message">
            {scheduledTime
              ? `Your post is scheduled for ${new Date(scheduledTime).toLocaleString()}`
              : "Your post has been published to the selected accounts."}
          </p>
          <p className="success-redirect">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-post-page">
      <div className="create-post-header">
        <h1 className="create-post-title">Create & Schedule Post</h1>
        <p className="create-post-subtitle">
          Upload content, write captions, and schedule for multiple platforms
        </p>
      </div>

      <form onSubmit={handleSubmit} className="create-post-form">
        {submitError && (
          <div className="form-error-alert">
            <span className="error-icon">⚠</span>
            <div className="error-content">
              <p className="error-title">Error</p>
              <p className="error-message">{submitError}</p>
            </div>
            <button
              type="button"
              className="error-close-btn"
              onClick={() => setSubmitError(null)}
            >
              ×
            </button>
          </div>
        )}

        <div className="form-content-wrapper">
          <div className="form-section">
            <h2 className="section-title">1. Select Media</h2>
            <MediaUpload
              onMediaSelect={handleMediaSelect}
              onMediaRemove={handleMediaRemove}
              currentMedia={media}
            />
          </div>

          <div className="form-section">
            <h2 className="section-title">2. Write Caption & Add Hashtags</h2>
            <CaptionInput
              value={caption}
              onChange={handleCaptionChange}
              onHashtagAdd={handleHashtagAdd}
            />
            {hashtags.length > 0 && (
              <div className="selected-hashtags">
                <label className="selected-hashtags-label">
                  Selected Hashtags
                </label>
                <div className="selected-hashtag-list">
                  {hashtags.map((tag) => (
                    <div key={tag} className="selected-hashtag-item">
                      #{tag}
                      <button
                        type="button"
                        className="remove-hashtag-btn"
                        onClick={() => handleHashtagRemove(tag)}
                        title="Remove hashtag"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-section">
            <h2 className="section-title">3. Schedule & Select Accounts</h2>
            <ScheduleSelector
              accounts={mockAccounts}
              scheduledTime={scheduledTime}
              selectedAccounts={selectedAccountIds}
              onScheduleChange={handleScheduleChange}
              onAccountToggle={handleAccountToggle}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Post..." : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
