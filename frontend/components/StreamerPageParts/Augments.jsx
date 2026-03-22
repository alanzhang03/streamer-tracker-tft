import React from "react";
import "./styles/Augments.scss";

const Augments = ({ playerTraits, synergyDict = {} }) => {
  return (
    <div className="augments-section">
      <div className="augments-grid">
        {playerTraits && playerTraits.length > 0 ? (
          playerTraits
            .sort((a, b) => b.tier_current - a.tier_current)
            .filter((trait) => trait.tier_current >= 1)
            .map((trait, index) => {
              const displayText =
                synergyDict[`${trait.name}${trait.tier_current}`] ||
                trait.name;
              return (
                <div key={index} className="augment-item">
                  {displayText}
                </div>
              );
            })
        ) : (
          <p>No augments available</p>
        )}
      </div>
    </div>
  );
};

export default Augments;
