import React from 'react';
import './ActivityFeed.css';

const ActivityFeed = ({ activities }) => {
  const formatTime = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / (1000 * 60));

    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="activity-feed">
      {activities && activities.length > 0 ? (
        <ul className="activity-list">
          {activities.map((activity) => (
            <li key={activity._id} className="activity-item">
              <span className="dot"></span>
              <p className="activity-text">
                {activity.description} – <span className="time">{formatTime(activity.createdAt)}</span>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">No activities yet</div>
      )}
    </div>
  );
};

export default ActivityFeed;
