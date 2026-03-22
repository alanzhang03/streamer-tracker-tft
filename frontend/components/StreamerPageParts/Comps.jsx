"use client";
import React from "react";
import Image from "next/image";
import "./styles/Comps.scss";

const getCostColorClass = (cost) => {
  switch (cost) {
    case 1: return "cost1";
    case 2: return "cost2";
    case 3: return "cost3";
    case 4: return "cost4";
    case 5: return "cost5";
    default: return "unknown";
  }
};

const Comps = ({ comps }) => {
  return (
    <div className="comps-section">
      <div className="comps-grid">
        {comps && comps.length > 0 ? (
          comps.map((comp, index) => (
            <div key={index} className="champion">
              <div className="star-tier">{"★".repeat(comp.tier)}</div>
              {comp.characterImage && (
                <Image
                  src={comp.characterImage}
                  title={comp.characterId}
                  alt={comp.characterId}
                  width={60}
                  height={60}
                  style={{
                    borderRadius: "8px",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                  className={`champion-icon ${getCostColorClass(comp.cost)}`}
                />
              )}
              <div className="champion-items">
                {comp.items.map((src, i) => (
                  <Image
                    key={i}
                    src={src}
                    alt={`item-${i}`}
                    width={20}
                    height={20}
                    className="champion-item"
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No comps available</p>
        )}
      </div>
    </div>
  );
};

export default Comps;
