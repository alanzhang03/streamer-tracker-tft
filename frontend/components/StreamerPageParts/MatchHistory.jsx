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
            <hr width="100%" size="2" />
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
      return "gold";
    case 2:
      return "Pink";
    case 3:
      return "Aqua";
    case 4:
      return "#90EE90";
    case 5:
      return "#4F6367";
    default:
      return "Grey";
  }
}
