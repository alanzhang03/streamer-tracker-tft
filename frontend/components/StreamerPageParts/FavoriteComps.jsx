import React from "react";
import "./styles/FavoriteComps.scss";

const FavoriteComps = ({ comps, onCompClick, selectedComps }) => {
  return (
    <div className="comps-table">
      {comps.map((comp, index) => {
        const compKey = comp.join(",");
        return (
          <div
            key={compKey} // use compKey as key
            className={`comp-element ${selectedComps.has(compKey) ? "selected" : ""}`}
            onClick={() => onCompClick(comp)}
          >
            {comp.map((item, idx) => (
              <div key={idx}>{item}</div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default FavoriteComps;
