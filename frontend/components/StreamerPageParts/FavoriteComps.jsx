import React from "react";
import "./styles/FavoriteComps.scss";

const FavoriteComps = ({ comps, onCompClick, selectedComps, traitIcons = {} }) => {
  return (
    <div className="comps-table">
      {comps.filter((comp) => comp.length > 0).map((comp, index) => {
        const compKey = comp.join(",");
        return (
          <div
            key={compKey}
            className={`comp-element ${selectedComps.has(compKey) ? "selected" : ""}`}
            onClick={() => onCompClick(comp)}
          >
            {comp.map((item, idx) => (
              <div key={idx} className="comp-trait">
                {traitIcons[item] && (
                  <img src={traitIcons[item]} alt={item} className="comp-trait-icon" />
                )}
                {item}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default FavoriteComps;
