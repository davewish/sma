/**
 * Media Upload Component
 */

import { useState } from "react";
import type { PostMedia, MediaType } from "@/types/post.types";
import "@/styles/components/media-upload.css";

interface MediaUploadProps {
  onMediaSelect: (media: PostMedia) => void;
  onMediaRemove: () => void;
  currentMedia: PostMedia | null;
}

export function MediaUpload({
  onMediaSelect,
  onMediaRemove,
  currentMedia,
}: MediaUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
  const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (
    file: File,
  ): { valid: boolean; error?: string; type?: MediaType } => {
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: "File size exceeds 500MB limit",
      };
    }

    if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { valid: true, type: "image" };
    }

    if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return { valid: true, type: "video" };
    }

    return {
      valid: false,
      error:
        "Unsupported file format. Please use JPG, PNG, GIF, WebP (images) or MP4, WebM (videos)",
    };
  };

  const processFile = (file: File) => {
    setError(null);
    const validation = validateFile(file);

    if (!validation.valid) {
      setError(validation.error || "Unknown error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      onMediaSelect({
        file,
        type: validation.type as MediaType,
        preview,
        size: file.size,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="media-upload">
      <h3>Upload Media</h3>

      {currentMedia ? (
        <div className="media-preview">
          <div className="media-container">
            {currentMedia.type === "image" ? (
              <img
                src={currentMedia.preview}
                alt="Preview"
                className="preview-image"
              />
            ) : (
              <video
                src={currentMedia.preview}
                controls
                className="preview-video"
              />
            )}
          </div>
          <div className="media-info">
            <p className="media-name">{currentMedia.file.name}</p>
            <p className="media-size">
              {(currentMedia.size / (1024 * 1024)).toFixed(2)} MB
            </p>
            <p className="media-type">
              {currentMedia.type === "image" ? "📷 Image" : "🎬 Video"}
            </p>
            <button
              className="remove-media-btn"
              onClick={onMediaRemove}
              type="button"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`upload-area ${dragActive ? "active" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="upload-icon">📸</div>
          <h4>Drag & drop your image or video here</h4>
          <p>or</p>
          <label className="upload-button">
            Browse Files
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleChange}
              hidden
            />
          </label>
          <p className="upload-hint">
            Supports JPG, PNG, GIF, WebP (images) and MP4, WebM (videos)
          </p>
          <p className="upload-size">Max file size: 500MB</p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
