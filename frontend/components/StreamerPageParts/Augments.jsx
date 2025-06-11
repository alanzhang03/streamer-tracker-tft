import React from "react";
import "./styles/Augments.scss";

const synergy_dict = {'TFT14_Immortal1': '2 Golden Ox', 'TFT14_Immortal2': '4 Golden Ox', 'TFT14_Immortal3': '6 Golden Ox', 'TFT14_Cutter1': '2 Executioner', 'TFT14_Cutter2': '3 Executioner', 
'TFT14_Cutter3': '4 Executioner', 'TFT14_Cutter4': '5 Executioner', 'TFT14_Strong1': '2 Slayer', 'TFT14_Strong2': '4 Slayer', 'TFT14_Strong3': '6 Slayer', 
'TFT14_Marksman1': '2 Marksman', 'TFT14_Marksman2': '4 Marksman', 'TFT14_Techie1': '2 Techie', 'TFT14_Techie2': '4 Techie', 'TFT14_Techie3': '6 Techie',
'TFT14_Techie4': '8 Techie', 'TFT14_Controller1': '2 Strategist', 'TFT14_Controller2': '3 Strategist', 'TFT14_Controller3': '4 Strategist', 'TFT14_Controller4': '5 Strategist', 
'TFT14_Armorclad1': '2 Bastion', 'TFT14_Armorclad2': '4 Bastion', 'TFT14_Armorclad3': '6 Bastion', 'TFT14_Armorclad4': '8 Bastion', 'TFT14_Supercharge1': '2 A.M.P.', 
'TFT14_Supercharge2': '3 A.M.P.', 'TFT14_Supercharge3': '4 A.M.P.', 'TFT14_Supercharge4': '5 A.M.P.', 'TFT14_HotRod1': '3 Nitro', 'TFT14_HotRod2': '4 Nitro', 
'TFT14_Cyberboss1': '2 Cyberboss', 'TFT14_Cyberboss1': '2 Cyberboss', 'TFT14_Cyberboss1': '2 Cyberboss', 'TFT14_Cyberboss2': '3 Cyberboss', 'TFT14_Cyberboss3': '4 Cyberboss', 
'TFT14_Divinicorp1': '1 Divinicorp', 'TFT14_Divinicorp2': '2 Divinicorp', 'TFT14_Divinicorp3': '3 Divinicorp', 'TFT14_Divinicorp4': '4 Divinicorp', 'TFT14_Divinicorp5': '5 Divinicorp', 
'TFT14_Divinicorp6': '6 Divinicorp', 'TFT14_Divinicorp7': '7 Divinicorp', 'TFT14_EdgeRunner1': '3 Exotech', 'TFT14_EdgeRunner2': '5 Exotech', 'TFT14_EdgeRunner3': '7 Exotech', 
'TFT14_EdgeRunner4': '10 Exotech', 'TFT14_Bruiser1': '2 Bruiser', 'TFT14_Bruiser2': '4 Bruiser', 'TFT14_Bruiser3': '6 Bruiser', 'TFT14_Thirsty1': '2 Dynamo', 'TFT14_Thirsty2': '3 Dynamo', 
'TFT14_Thirsty3': '4 Dynamo', 'TFT14_Mob1': '3 Syndicate', 'TFT14_Mob2': '5 Syndicate', 'TFT14_Mob3': '7 Syndicate', 'TFT14_Netgod1': 'God of the Net', 'TFT14_Swift1': '2 Rapidfire', 
'TFT14_Swift2': '4 Rapidfire', 'TFT14_Swift3': '6 Rapidfire', 'TFT14_StreetDemon1': '3 Street Demon', 'TFT14_StreetDemon2': '5 Street Demon', 'TFT14_StreetDemon3': '7 Street Demon', 
'TFT14_StreetDemon4': '10 Street Demon', 'TFT14_AnimaSquad1': '3 Anima Squad', 'TFT14_AnimaSquad2': '5 Anima Squad', 'TFT14_AnimaSquad3': '7 Anima Squad', 'TFT14_AnimaSquad4': '10 Anima Squad', 
'TFT14_Suits1': '3 Cypher', 'TFT14_Suits2': '4 Cypher', 'TFT14_Suits3': '5 Cypher', 'TFT14_BallisTek1': '2 BoomBot', 'TFT14_BallisTek2': '4 BoomBot', 'TFT14_BallisTek3': '6 BoomBot', 
'TFT14_Vanguard1': '2 Vanguard', 'TFT14_Vanguard2': '4 Vanguard', 'TFT14_Vanguard3': '6 Vanguard', 'TFT14_ViegoUniqueTrait1': 'Soul Killer', 'TFT14_Overlord1': 'Overlord', 'TFT14_Virus1': 'Virus'};

const Augments = ({ playerTraits }) => {
  return (
    <div className="augments-section">
      <div className="augments-grid">
        {playerTraits && playerTraits.length > 0 ? (
          playerTraits
            .sort((a, b) => b.tier_current - a.tier_current)
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
