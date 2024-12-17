"use client";
import React, { useEffect, useState } from "react";
import "./styles/StreamerPage.scss";

const StreamerPage = ({ usernameTagline }) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const API_ENDPOINT = "http://localhost:3002/api/match-history";
	const headers = {
		"Content-Type": "application/json",
		"page-number": "0",
		"username-tagline": usernameTagline,
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const response = await fetch(API_ENDPOINT, { headers });
				if (!response.ok) {
					throw new Error(`Error: ${response.status}`);
				}
				const result = await response.json();
				setData(result);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [usernameTagline]);

	//some dummy data
	return (
		<div className="streamer-page">
			<h1>{usernameTagline}'s Match History</h1>
			{loading && <p>Loading...</p>}
			{error && <p style={{ color: "red" }}>Error: {error}</p>}
			{data && (
				<div className="match-history">
					{data.map((match, index) => {
						const player = match["Player 0"];
						return (
							<div key={index} className="match-card">
								<div className="match-header">
									<h2>
										Game {index + 1}: Placement {player.placement}
									</h2>
									<p>
										<strong>Gold Left:</strong> {player.gold_left} |{" "}
										<strong>Level:</strong> {player.level}
									</p>
								</div>
								<div className="match-details">
									<div className="comp-section">
										<h3>Composition:</h3>
										<ul>
											{player.comp.map((champion, i) => (
												<li key={i}>{champion}</li>
											))}
										</ul>
									</div>
									<div className="traits-section">
										<h3>Traits:</h3>
										<ul>
											{player.traits.map((trait, i) => (
												<li key={i}>
													<strong>{trait.name}:</strong> Tier{" "}
													{trait.tier_current}/{trait.tier_total} (
													{trait.num_units} units)
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default StreamerPage;
