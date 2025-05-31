import React from "react";
import "./styles/Stats.scss";

const Stats = ({ stats }) => {
  return (
    <div>
      <div className="grid-container">
        <div className="grid-item">
          LP: <br />
          {stats.lp}
        </div>
        <div className="grid-item">
          Avg Place: <br />
          {(stats.sum_placements / stats.num_games).toFixed(2)}
        </div>
        <div className="grid-item">
          Games: <br />
          {stats.num_games}
        </div>
        <div className="grid-item">
          Top Four: <br />
          {((stats.top_four / stats.num_games) * 100).toFixed(2) + "%"}
        </div>
        <div className="grid-item">
          Wins: <br />
          {stats.wins}
        </div>
        <div className="grid-item">
          Win rate: <br />
          {((stats.wins / stats.num_games) * 100).toFixed(2) + "%"}
        </div>
      </div>
    </div>
  );
};

export default Stats;
