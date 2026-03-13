/**
 * Caption Input Component
 */

import { useState } from "react";
import "@/styles/components/caption-input.css";

interface CaptionInputProps {
  value: string;
  onChange: (caption: string) => void;
  onHashtagAdd: (hashtag: string) => void;
}

const SUGGESTED_HASHTAGS = [
  "socialmedia",
  "marketing",
  "content",
  "creator",
  "business",
  "digital",
  "engagement",
  "growth",
  "instagram",
  "tiktok",
  "facebook",
  "trending",
  "viralcontent",
  "brandawareness",
];

export function CaptionInput({
  value,
  onChange,
  onHashtagAdd,
}: CaptionInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>(SUGGESTED_HASHTAGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const wordCount = value.split(/\s+/).filter((word) => word.length > 0).length;
  const charCount = value.length;

  const handleHashtagSearch = (term: string) => {
    setSearchTerm(term);
    if (term) {
      const filtered = SUGGESTED_HASHTAGS.filter((tag) =>
        tag.toLowerCase().includes(term.toLowerCase()),
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions(SUGGESTED_HASHTAGS);
      setShowSuggestions(true);
    }
  };

  const handleHashtagSelect = (hashtag: string) => {
    onHashtagAdd(hashtag);
    setSearchTerm("");
    setShowSuggestions(false);
  };

  return (
    <div className="caption-input-container">
      <h3>Caption & Hashtags</h3>

      <div className="caption-section">
        <label htmlFor="caption">Post Caption</label>
        <textarea
          id="caption"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your post caption here... Use @ to mention accounts and # for hashtags"
          className="caption-textarea"
          rows={6}
        />
        <div className="caption-stats">
          <span>Words: {wordCount}</span>
          <span>Characters: {charCount}</span>
        </div>
      </div>

      <div className="hashtag-section">
        <label htmlFor="hashtag-search">Add Hashtags</label>
        <div className="hashtag-search-container">
          <input
            id="hashtag-search"
            type="text"
            value={searchTerm}
            onChange={(e) => handleHashtagSearch(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search or type hashtag (e.g., marketing)"
            className="hashtag-search"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="hashtag-suggestions">
              {suggestions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="hashtag-suggestion"
                  onClick={() => handleHashtagSelect(tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="hashtag-hint">
          💡 Use 5-10 relevant hashtags to increase discoverability
        </p>
      </div>
    </div>
  );
}
