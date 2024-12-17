"use client";
import React from "react";
import Augments from "./Augments";
import Comps from "./Comps";
import Items from "./Items";
import Placements from "./Placements";
import MatchHistory from "./MatchHistory";
import "./styles/StreamerPage.scss";

// const StreamerPage = ({ streamer }) => {
// 	return (
// 		<div className="streamer-page">
// 			<div className="header-section">
// 				<h1>{streamer.name}</h1>
// 				<img
// 					src={streamer.image}
// 					alt={streamer.name}
// 					className="streamer-img"
// 				/>
// 				<p>{streamer.bio}</p>
// 			</div>

// 			<div className="data-sections">
// 				<Augments augments={streamer.augments} />
// 				<Comps comps={streamer.comps} />
// 				<Items items={streamer.items} />
// 				<Placements placements={streamer.placements} />
// 			</div>
// 			<MatchHistory matchHistory={streamer.matchHistory} />
// 		</div>
// 	);
// };

import { useEffect, useState } from 'react';

const StreamerPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Endpoint URL and Headers
  const API_ENDPOINT = 'http://localhost:3002/api/match-history'; // Replace with your API URL
  const headers = {
    'Content-Type': 'application/json',
    'page-number': '1',
		'username-tagline': 'VIT setsuko #NA2'
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
        setData(result); // Store the data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures it runs once when mounted

  // Render loading, error, or data
  return (
    <div>
      <h1>Fetch Data Example</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data && (
        <div>
          <h2>Data:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};


export default StreamerPage;
