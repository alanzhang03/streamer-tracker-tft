import React from "react";
import "./styles/FavoriteComps.scss";

const FavoriteComps = ({ comps, onCompClick, selectedComps }) => {
  return (
    <div className="comps-table">
      {comps.map((comp) => (
        <div
          key={comp}
          className={`comp-element ${
            selectedComps.has(comp) ? "selected" : ""
          }`}
          onClick={() => onCompClick(comp)}
        >
          {comp}
        </div>
      ))}
    </div>
  );
};

export default FavoriteComps;
