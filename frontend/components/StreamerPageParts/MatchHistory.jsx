"use client";
import React from "react";
import Image from "next/image";
import "./styles/MatchHistory.scss";
import Comps from "./Comps";

const MatchHistory = ({ data, synergy_dict, images }) => {
	return (
		<div className="match-history">
			{data.map((match, index) => {
				const player = match["Player 0"];

				return (
					<div key={index} className="match-card">
						<div className="match-header">
							<div className="header-info">
								<h2
									style={{
										color:
											player.placement === 1
												? "#ffcc00"
												: player.placement === 2
												? "#c0c0c0"
												: player.placement === 3
												? "#cd7f32"
												: "#000000",
									}}
								>
									Placement: {player.placement}
								</h2>
								<p>+{player.lp_gain || 0} LP</p>
								<p>Gold Left: {player.gold_left}</p>
								<p>Level: {player.level}</p>
							</div>

							<div className="header-traits">
								<div className="traits-icons">
									{player.traits.map((trait, i) => {
										if (trait.tier_current > 0) {
											const traitName =
												synergy_dict[
													trait.name.concat("", trait.tier_current)
												] || trait.name;

											const traitKey = Object.keys(images).find((key) =>
												key.includes(`Trait_Icon_13_${trait.name}`)
											);
											const traitImage = images[traitKey];

											return (
												<div key={i} className="trait">
													{traitImage && (
														<Image
															src={traitImage}
															alt={traitName}
															width={30}
															height={30}
															className="trait-icon"
														/>
													)}
													<span>{traitName}</span>
												</div>
											);
										}
									})}
								</div>
							</div>
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
