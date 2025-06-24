"use client";
import React from "react";
import Image from "next/image";
import "./styles/Comps.scss";

const Comps = ({ comps }) => {
  const names_dict = {
    TFT14_Brand: "Brand",
    TFT14_Darius: "Darius",
    TFT14_DrMundo: "Dr. Mundo",
    TFT14_Elise: "Elise",
    TFT14_Fiddlesticks: "Fiddlesticks",
    TFT14_Galio: "Galio",
    TFT14_Garen: "Garen",
    TFT14_LeBlanc: "LeBlanc",
    TFT14_MissFortune: "Miss Fortune",
    TFT14_Morgana: "Morgana",
    TFT14_Neeko: "Neeko",
    TFT14_Renekton: "Renekton",
    TFT14_Rengar: "Rengar",
    TFT14_Samira: "Samira",
    TFT14_Senna: "Senna",
    TFT14_Shaco: "Shaco",
    TFT14_TwistedFate: "Twisted Fate",
    TFT14_Varus: "Varus",
    TFT14_Veigar: "Veigar",
    TFT14_Vex: "Vex",
    TFT14_Zed: "Zed",
    TFT14_Zeri: "Zeri",
    TFT14_Zyra: "Zyra",
    TFT14_Braum: "Braum",
    TFT14_NidaleeCougar: "Nidalee",
    TFT14_Shyvana: "Shyvana",
    TFT14_Kindred: "Kindred",
    TFT14_Yuumi: "Yuumi",
    TFT14_Illaoi: "Illaoi",
    TFT14_Seraphine: "Seraphine",
    TFT14_Xayah: "Xayah",
    TFT14_Jhin: "Jhin",
    TFT14_Naafiri: "Naafiri",
    TFT14_Gragas: "Gragas",
    TFT14_KogMaw: "Kog'Maw",
    TFT14_Skarner: "Skarner",
    TFT14_Jax: "Jax",
    TFT14_Kobuko: "Kobuko",
    TFT14_Sejuani: "Sejuani",
    TFT14_Poppy: "Poppy",
    TFT14_Ziggs: "Ziggs",
    TFT14_Chogath: "ChoGath",
    TFT14_Urgot: "Urgot",
    TFT14_Sylas: "Sylas",
    TFT14_Aurora: "Aurora",
    TFT14_Vayne: "Vayne",
    TFT14_Leona: "Leona",
    TFT14_Vi: "Vi",
    TFT14_Mordekaiser: "Mordekaiser",
    TFT14_Alistar: "Alistar",
    TFT14_Viego: "Viego",
    TFT14_Jarvan: "Jarvan IV",
    TFT14_Graves: "Graves",
    TFT14_Annie: "Annie",
    TFT14_Rhaast: "Rhaast",
    TFT14_SummonLevel2: "R-080T",
    TFT14_SummonLevel4: "T-43X",
    TFT14_Draven: "Draven",
    TFT14_Zac: "Zac",
    TFT14_Jinx: "Jinx",
    TFT14_Ekko: "Ekko",
    TFT14_NPC_Drone: "Mechadrone",
    TFT14_NPC_AzirSoldier: "Mechasoldier",
    TFT14_NPC_Super: "Mechaminion",
    TFT14_NPC_AurelionSol: "Mechaurelion",
    TFT14_Aphelios: "Aphelios",
  };

  const cost1 = [
    "Alistar",
    "Dr. Mundo",
    "Jax",
    "Kindred",
    "Kog'Maw",
    "Morgana",
    "Nidalee",
    "Poppy",
    "Seraphine",
    "Shaco",
    "Sylas",
    "Vi",
    "Zyra",
  ];
  const cost2 = [
    "Darius",
    "Ekko",
    "Graves",
    "Illaoi",
    "Jhin",
    "LeBlanc",
    "Naafiri",
    "Rhaast",
    "Shyvana",
    "Skarner",
    "Twisted Fate",
    "Vayne",
    "Veigar",
  ];
  const cost3 = [
    "Braum",
    "Draven",
    "Elise",
    "Fiddlesticks",
    "Galio",
    "Gragas",
    "Jarvan IV",
    "Jinx",
    "Mordekaiser",
    "Rengar",
    "Senna",
    "Yuumi",
    "Varus",
  ];
  const cost4 = [
    "Annie",
    "Aphelios",
    "Brand",
    "Cho'Gath",
    "Leona",
    "Miss Fortune",
    "Neeko",
    "Sejuani",
    "Vex",
    "Xayah",
    "Zed",
    "Zeri",
    "Ziggs",
  ];
  const cost5 = [
    "Aurora",
    "Garen",
    "Kobuko",
    "Renekton",
    "Samira",
    "Urgot",
    "Viego",
    "Zac",
  ];

  const getCostColorClass = (name) => {
    if (cost1.includes(name)) return "cost1";
    if (cost2.includes(name)) return "cost2";
    if (cost3.includes(name)) return "cost3";
    if (cost4.includes(name)) return "cost4";
    if (cost5.includes(name)) return "cost5";
    return "unknown";
  };

  return (
    <div className="comps-section">
      <div className="comps-grid">
        {comps && comps.length > 0 ? (
          comps.map((comp, index) => {
            const characterName = names_dict[comp.characterId] || "Unknown";
            console.log(characterName);
            return (
              <div key={index} className="champion">
                <div className="star-tier">{"★".repeat(comp.tier)}</div>
                {comp.characterImage && (
                  <Image
                    src={comp.characterImage}
                    title={comp.characterId}
                    alt={characterName}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "25px",
                      objectFit: "cover",
                      objectPosition: "right",
                    }}
                    className={`champion-icon ${getCostColorClass(
                      characterName
                    )}`}
                  />
                )}
                <div className="champion-items">
                  {comp.items.map((src, i) => {
                    return (
                      <Image
                        key={i}
                        src={src}
                        alt={`item-${i}`}
                        width={20}
                        height={20}
                      />
                    );
                  })}
                </div>
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
