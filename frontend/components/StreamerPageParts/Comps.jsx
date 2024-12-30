"use client";
import React from "react";
import Image from "next/image";
import "./styles/Comps.scss";

const Comps = ({ comps }) => {
  const names_dict = {
    TFT13_Silco: "Silco",
    TFT13_Caitlyn: "Caitlyn",
    TFT13_Ekko: "Ekko",
    TFT13_Malzahar: "Malzahar",
    TFT13_Twitch: "Twitch",
    TFT13_Cassiopeia: "Cassiopeia",
    TFT13_LeBlanc: "LeBlanc",
    TFT13_Heimerdinger: "Heimerdinger",
    TFT13_Jayce: "Jayce",
    TFT13_Lieutenant: "Sevika",
    TFT13_Vi: "Vi",
    TFT13_Jinx: "Jinx",
    TFT13_Nami: "Nami",
    TFT13_Corki: "Corki",
    TFT13_Ambessa: "Ambessa",
    TFT13_Mordekaiser: "Mordekaiser",
    TFT13_Zoe: "Zoe",
    TFT13_Camille: "Camille",
    TFT13_RenataGlasc: "Renata",
    TFT13_Akali: "Akali",
    TFT13_Ezreal: "Ezreal",
    TFT13_Draven: "Draven",
    TFT13_Ziggs: "Ziggs",
    TFT13_Gremlin: "Smeech",
    TFT13_Shooter: "Maddie",
    TFT13_Blue: "Powder",
    TFT13_Zeri: "Zeri",
    TFT13_Red: "Violet",
    TFT13_Vex: "Vex",
    TFT13_Nocturne: "Nocturne",
    TFT13_Darius: "Darius",
    TFT13_Irelia: "Irelia",
    TFT13_FlyGuy: "Scar",
    TFT13_NunuWillump: "Nunu",
    TFT13_Prime: "Vander",
    TFT13_Beardy: "Loris",
    TFT13_Chainsaw: "Renni",
    TFT13_Vladimir: "Vladimir",
    TFT13_Rell: "Rell",
    TFT13_Sett: "Sett",
    TFT13_Amumu: "Amumu",
    TFT13_Blitzcrank: "Blitzcrank",
    TFT13_Singed: "Singed",
    TFT13_Zyra: "Zyra",
    TFT13_Gangplank: "Gangplank",
    TFT13_Leona: "Leona",
    TFT13_KogMaw: "KogMaw",
    TFT13_TwistedFate: "Twisted Fate",
    TFT13_Lux: "Lux",
    TFT13_Morgana: "Morgana",
    TFT13_Tristana: "Tristana",
    TFT13_Swain: "Swain",
    TFT13_Urgot: "Urgot",
    TFT13_Trundle: "Trundle",
    TFT13_Fish: "Fish",
    TFT13_Warwick: "Warwick",
    TFT13_Viktor: "Viktor",
    TFT13_Rumble: "Rumble",
    TFT13_MissMage: "Evolved Miss Fortune",
    TFT13_Lissandra: "Lissandra",
    TFT13_Garen: "Garen",
    TFT13_Vayne: "Vayne",
  };

  return (
    <div className="comps-section">
      <div className="comps-grid">
        {comps && comps.length > 0 ? (
          comps.map((comp, index) => {
            const characterName = names_dict[comp.characterId] || "Unknown";
            return (
              <div key={index} className="champion">
                <div className="star-tier">{"★".repeat(comp.tier)}</div>
                {comp.characterImage && (
                  <Image
                    src={comp.characterImage}
                    alt={characterName}
                    width={40}
                    height={40}
                    className="champion-icon"
                  />
                )}
              </div>
            );
          })
        ) : (
          <p>No comps available</p>
        )}
      </div>
    </div>
  );
};

export default Comps;
