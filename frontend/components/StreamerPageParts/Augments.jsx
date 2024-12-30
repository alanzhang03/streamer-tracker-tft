import React from "react";
import "./styles/Augments.scss";

const synergy_dict = {
  TFT13_Academy1: "3 Academy",
  TFT13_Academy2: "4 Academy",
  TFT13_Academy3: "5 Academy",
  TFT13_Academy4: "6 Academy",
  TFT13_Ambassador1: "1 Emissary",
  TFT13_Ambassador2: "4 Emissary",
  TFT13_Ambusher1: "2 Ambusher",
  TFT13_Ambusher2: "3 Ambusher",
  TFT13_Ambusher3: "4 Ambusher",
  TFT13_Ambusher4: "5 Ambusher",
  TFT13_Bruiser1: "2 Bruiser",
  TFT13_Bruiser2: "4 Bruiser",
  TFT13_Bruiser3: "6 Bruiser",
  TFT13_Cabal1: "3 Black Rose",
  TFT13_Cabal2: "4 Black Rose",
  TFT13_Cabal3: "5 Black Rose",
  TFT13_Cabal4: "7 Black Rose",
  TFT13_Challenger1: "2 Quickstriker",
  TFT13_Challenger2: "3 Quickstriker",
  TFT13_Challenger3: "4 Quickstriker",
  TFT13_Crime1: "3 Chem-Baron",
  TFT13_Crime2: "4 Chem-Baron",
  TFT13_Crime3: "5 Chem-Baron",
  TFT13_Crime4: "6 Chem-Baron",
  TFT13_Crime5: "7 Chem-Baron",
  TFT13_Experiment1: "3 Experiment",
  TFT13_Experiment2: "5 Experiment",
  TFT13_Experiment3: "7 Experiment",
  TFT13_Family1: "3 Family",
  TFT13_Family2: "4 Family",
  TFT13_Family3: "5 Family",
  TFT13_FormSwapper1: "2 Form Swapper",
  TFT13_FormSwapper2: "4 Form Swapper",
  TFT13_FormSwapper3: "6 Form Swapper",
  TFT13_Hextech1: "2 Automata",
  TFT13_Hextech2: "4 Automata",
  TFT13_Hextech3: "6 Automata",
  TFT13_Hoverboard1: "2 Firelight",
  TFT13_Hoverboard2: "3 Firelight",
  TFT13_Hoverboard3: "4 Firelight",
  TFT13_Invoker1: "2 Visionary",
  TFT13_Invoker2: "4 Visionary",
  TFT13_Invoker3: "6 Visionary",
  TFT13_Invoker4: "8 Visionary",
  TFT13_Martialist1: "2 Artillerist",
  TFT13_Martialist2: "4 Artillerist",
  TFT13_Martialist3: "6 Artillerist",
  TFT13_Pugilist1: "2 Pit Fighter",
  TFT13_Pugilist2: "4 Pit Fighter",
  TFT13_Pugilist3: "6 Pit Fighter",
  TFT13_Pugilist4: "8 Pit Fighter",
  TFT13_Rebel1: "3 Rebel",
  TFT13_Rebel2: "5 Rebel",
  TFT13_Rebel3: "7 Rebel",
  TFT13_Rebel4: "10 Rebel",
  TFT13_Scrap1: "2 Scrap",
  TFT13_Scrap2: "4 Scrap",
  TFT13_Scrap3: "6 Scrap",
  TFT13_Scrap4: "9 Scrap",
  TFT13_Sniper1: "2 Sniper",
  TFT13_Sniper2: "4 Sniper",
  TFT13_Sniper3: "6 Sniper",
  TFT13_Squad1: "2 Enforcer",
  TFT13_Squad2: "4 Enforcer",
  TFT13_Squad2: "4 Enforcer",
  TFT13_Squad3: "6 Enforcer",
  TFT13_Squad4: "8 Enforcer",
  TFT13_Squad5: "10 Enforcer",
  TFT13_Titan1: "2 Sentinel",
  TFT13_Titan2: "4 Sentinel",
  TFT13_Titan3: "6 Sentinel",
  TFT13_Titan4: "8 Sentinel",
  TFT13_Warband1: "2 Conqueror",
  TFT13_Warband2: "4 Conqueror",
  TFT13_Warband3: "6 Conqueror",
  TFT13_Warband4: "9 Conqueror",
  TFT13_Watcher1: "2 Watcher",
  TFT13_Watcher2: "4 Watcher",
  TFT13_Watcher3: "6 Watcher",
  TFT13_Sorcerer1: "2 Sorcerer",
  TFT13_Sorcerer2: "4 Sorcerer",
  TFT13_Sorcerer3: "6 Sorcerer",
  TFT13_Sorcerer4: "8 Sorcerer",
  TFT13_Infused1: "2 Dominator",
  TFT13_Infused2: "4 Dominator",
  TFT13_Infused3: "6 Dominator",
};

const Augments = ({ playerTraits }) => {
  return (
    <div className="augments-section">
      <h3>Augments</h3>
      <div className="augments-grid">
        {playerTraits && playerTraits.length > 0 ? (
          playerTraits
            .filter((trait) => trait.tier_current >= 1)
            .map((trait, index) => {
              const displayText =
                synergy_dict[`${trait.name}${trait.tier_current}`] ||
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
