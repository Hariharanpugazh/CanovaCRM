import React from 'react';
import './TeamSearch.css';

const TeamSearch = ({ onSearch, results }) => {
  return (
    <div className="team-search">
      <input
        type="text"
        placeholder="Search team member..."
        onChange={(e) => onSearch(e.target.value)}
        className="search-input"
      />
      {results && results.length > 0 && (
        <div className="search-dropdown">
          {results.map((result) => (
            <div key={result._id} className="search-item">
              <div>{result.name}</div>
              <div className="search-email">{result.email}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamSearch;
