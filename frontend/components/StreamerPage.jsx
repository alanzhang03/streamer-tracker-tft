"use client";
import React, { useEffect, useState } from "react";
import Augments from "./Augments";
import Comps from "./Comps";
import Items from "./Items";
import Placements from "./Placements";
import MatchHistory from "./MatchHistory";
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

	return (
		<div className="streamer-page">
			<h1>Streamer Page</h1>
			{loading && <p>Loading...</p>}
			{error && <p style={{ color: "red" }}>Error: {error}</p>}
			{data && (
				<div>
					<h2>Data for {usernameTagline}:</h2>
					<pre>{JSON.stringify(data, null, 2)}</pre>
				</div>
			)}
		</div>
	);
};

export default StreamerPage;
