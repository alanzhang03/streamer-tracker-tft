import React from "react";
import "./styles/Stats.scss";

const Stats = ({ stats }) => {
  return (
    <div>
      <div className="grid-container">
        <div className="grid-item">
          <span className="stats-numbers">{stats.lp}</span>
          <span>LP</span>
        </div>
        <div className="grid-item">
          <span className="stats-numbers">
            {(stats.sum_placements / stats.num_games).toFixed(2)}
          </span>
          <span>Avg Place</span>
        </div>
        <div className="grid-item">
          <span className="stats-numbers">{stats.num_games}</span>
          <span>Games</span>
        </div>
        <div className="grid-item">
          <span className="stats-numbers">
            {((stats.top_four / stats.num_games) * 100).toFixed(2) + "%"}
          </span>
          <span>Top Four</span>
        </div>
        <div className="grid-item">
          <span className="stats-numbers">{stats.wins}</span>
          <span>Wins</span>
        </div>
        <div className="grid-item">
          <span className="stats-numbers">
            {((stats.wins / stats.num_games) * 100).toFixed(2) + "%"}
          </span>
          <span>Win rate</span>
        </div>
      </div>
    </div>
  );
};

export default Stats;
