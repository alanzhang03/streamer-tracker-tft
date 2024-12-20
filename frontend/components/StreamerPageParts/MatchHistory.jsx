"use client";
import React from "react";
import Image from "next/image";
import "./styles/MatchHistory.scss";

const MatchHistory = ({ data, names_dict, synergy_dict, images }) => {
	return (
		<div className="match-history">
			{data.map((match, index) => {
				const player = match["Player 0"];

				return (
					<div key={index} className="match-card">
						<div className="match-header">
							<div className="header-info">
								<h2>Placement: {player.placement}</h2>
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

						<div className="champions-row">
							{player.units.map((champion, i) => {
								const characterName = names_dict[champion["character_id"]];
								const imageKey = Object.keys(images).find((key) =>
									key.startsWith(champion["character_id"])
								);
								const characterImage = images[imageKey]?.default;

								return (
									<div key={i} className="champion">
										{characterImage && (
											<Image
												src={characterImage}
												alt={characterName}
												width={40}
												height={40}
												className="champion-icon"
											/>
										)}
										<div className="star-tier">{"★".repeat(champion.tier)}</div>
									</div>
								);
							})}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default MatchHistory;
