import React from "react";
import Image from "next/image";
import "./styles/MatchHistory.scss";
import Comps from "./Comps";
import Augments from "./Augments"; 

const MatchHistory = ({ data, images }) => {
  return (
    <div className="match-history">
      {data.map((match, index) => {
        const player = match["Player 0"];

        return (
          <div key={index} className="match-card">
            <div className="match-header">
              <div className="header-info">
                <h2 style={{ color: determineColor(player.placement) }}>
                  Placement: {player.placement}
                </h2>
                <p>+{player.lp_gain || 0} LP</p>
                <p>Gold Left: {player.gold_left}</p>
                <p>Level: {player.level}</p>
              </div>
              <Augments playerTraits={player.traits} />
            </div>
            <Comps
              comps={player.units.map((champion) => ({
                characterId: champion["character_id"],
                characterImage:
                  images[
                    Object.keys(images).find((key) =>
                      key.startsWith(champion["character_id"])
                    )
                  ]?.default,
                tier: champion.tier,
              }))}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MatchHistory;

function determineColor(placement) {
  switch (placement) {
    case 1:
      return "#ffcc00";
    case 2:
      return "#c0c0c0";
    case 3:
      return "#cd7f32";
    default:
      return "#000000";
  }
}
