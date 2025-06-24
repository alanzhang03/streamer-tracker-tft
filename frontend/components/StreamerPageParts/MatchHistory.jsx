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
  getTimeAgo,
  determineColor,
}) => {
  return (
    <div className="match-history">
      {data.map((match, index) => {
        const player = Object.values(match).find(
          (p) => p.username_tagline === usernameTagline
        );
        const timestamp = player.game_datetime;

        return (
          <div key={index} className="match-card">
            <div className="comp-title">
              <h2>{player.comp.join(" ")}</h2>
            </div>
            <div className="match-header">
              <div className="header-info">
                <div className="header-info-combined">
                  <div className="lp-number-remove-gap">
                    <h3>Placement:</h3>
                    <h3
                      style={{
                        color: determineColor(player.placement),
                        paddingLeft: "none",
                      }}
                    >
                      {player.placement}
                    </h3>
                  </div>
                  <p style={{ color: player.lp_gain >= 0 ? "green" : "red" }}>
                    {player.lp_gain >= 0
                      ? `+${player.lp_gain}`
                      : `${player.lp_gain}`}{" "}
                    LP
                  </p>
                  <p>Gold Left: {player.gold_left}</p>
                  <p>Level: {player.level}</p>
                  <p>Patch: {match.patch}</p>
                  <p className="get-time-stamp">{getTimeAgo(timestamp)}</p>
                </div>
              </div>

              <Augments playerTraits={player.traits} images={augmentImages} />
            </div>
            <hr
              width="100%"
              size="2"
              style={{ borderColor: determineColor(player.placement) }}
            />
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
