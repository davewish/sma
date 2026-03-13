/**
 * Calendar Component for scheduled posts
 */

import { useState } from "react";
import type { ScheduledPost } from "@/types/dashboard.types";
import "@/styles/components/calendar.css";

interface CalendarProps {
  posts: ScheduledPost[];
  onPostClick: (post: ScheduledPost) => void;
  onDateSelect: (date: string) => void;
}

export function Calendar({ posts, onPostClick, onDateSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getPostsForDay = (day: number): ScheduledPost[] => {
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1,
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return posts.filter((post) => post.scheduledTime.startsWith(dateStr));
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="calendar">
      <div className="calendar-header">
        <h2>Post Calendar</h2>
        <div className="month-navigation">
          <button onClick={previousMonth}>←</button>
          <span className="month-year">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button onClick={nextMonth}>→</button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="weekdays">
          <div className="weekday">Sun</div>
          <div className="weekday">Mon</div>
          <div className="weekday">Tue</div>
          <div className="weekday">Wed</div>
          <div className="weekday">Thu</div>
          <div className="weekday">Fri</div>
          <div className="weekday">Sat</div>
        </div>

        <div className="days">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="day empty"></div>;
            }

            const dayPosts = getPostsForDay(day);
            const dateStr = `${currentDate.getFullYear()}-${String(
              currentDate.getMonth() + 1,
            ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            return (
              <div
                key={day}
                className={`day ${dayPosts.length > 0 ? "has-posts" : ""}`}
                onClick={() => onDateSelect(dateStr)}
              >
                <span className="day-number">{day}</span>
                {dayPosts.length > 0 && (
                  <div className="posts-indicator">
                    {dayPosts.slice(0, 2).map((post) => (
                      <div
                        key={post.id}
                        className="post-dot"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPostClick(post);
                        }}
                        title={post.content}
                      >
                        {post.platform === "instagram" && "📷"}
                        {post.platform === "facebook" && "📘"}
                        {post.platform === "tiktok" && "🎵"}
                      </div>
                    ))}
                    {dayPosts.length > 2 && (
                      <span className="more-posts">+{dayPosts.length - 2}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
