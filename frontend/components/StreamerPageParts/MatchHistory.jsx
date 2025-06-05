import React from "react";
import "./styles/MatchHistory.scss";
import Comps from "./Comps";
import Augments from "./Augments";

const MatchHistory = ({
  data,
  champ_images,
  item_images,
  augmentImages,
  usernameTagline,
}) => {
  return (
    <div className="match-history">
      {data.map((match, index) => {
        const player = Object.values(match).find(
          (p) => p.username_tagline === usernameTagline
        );
        // const player = match["Player 0"];
        const timestamp = player.game_datetime;

        return (
          <div key={index} className="match-card">
            <div className="comp-title">
              <h2>{player.comp.join(" ")}</h2>
            </div>
            <div className="match-header">
              <div className="header-info">
                
                <div className="header-info-row-1">
                  <h2 style={{ color: determineColor(player.placement) }}>
                    Placement: {player.placement}
                  </h2>
                  <p style={{ color: player.lp_gain >= 0 ? "green" : "red" }}>
                    {player.lp_gain >= 0
                      ? `+${player.lp_gain}`
                      : `${player.lp_gain}`}{" "}
                    LP
                  </p>
                  <p>Gold Left: {player.gold_left}</p>
                  <p>Level: {player.level}</p>
                </div>
                <div className="header-info-row-2">
                  <p className="get-time-stamp">{getTimeAgo(timestamp)}</p>
                </div>
              </div>

              <Augments playerTraits={player.traits} images={augmentImages} />
            </div>
            <hr width="100%" size="2" />
            <Comps
              comps={player.units.map((champion) => {
                const itemNames = champion["itemNames"] || [];
                const items = itemNames
                  .map((name) => name + ".png")
                  .filter((filename) => item_images[filename])
                  .map(
                    (filename) =>
                      item_images[filename]?.default || item_images[filename]
                  );

                return {
                  characterId: champion["character_id"],
                  characterImage:
                    champ_images[
                      Object.keys(champ_images).find((key) =>
                        key.startsWith(champion["character_id"])
                      )
                    ]?.default || null,
                  tier: champion.tier,
                  items,
                };
              })}
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
      return "pink";
    case 3:
      return "aqua";
    case 4:
      return "#90EE90";
    case 5:
      return "#4F6367";
    default:
      return "grey";
  }
}

function getTimeAgo(timestamp) {
  const matchDate = new Date(timestamp);
  const now = new Date();
  const differenceInTime = now - matchDate;
  const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

  if (differenceInDays < 1) {
    const differenceInHours = Math.floor(differenceInTime / (1000 * 3600));
    if (differenceInHours < 1) {
      const differenceInMinutes = Math.floor(differenceInTime / (1000 * 60));
      return differenceInMinutes < 1
        ? "Just now"
        : `${differenceInMinutes} minutes ago`;
    }
    return `${differenceInHours} hours ago`;
  }
  if (differenceInDays == 1) {
    return `${differenceInDays} day ago`;
  }
  return `${differenceInDays} days ago`;
}
