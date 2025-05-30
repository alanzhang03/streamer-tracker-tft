import React, { useEffect, useState } from "react";
import "./styles/StreamerPage.scss";
import MatchHistory from "./StreamerPageParts/MatchHistory";

const importAllImages = (requireContext) => {
  const images = {};
  requireContext.keys().forEach((key) => {
    const filename = key.replace("./", "");
    images[filename] = requireContext(key);
  });
  return images;
};

const champ_images = importAllImages(
  require.context("./assets/champions", false, /\.(png|jpe?g|svg)$/)
);

const item_images = importAllImages(
  require.context("./assets/items", false, /\.(png|jpe?g|svg)$/)
);

const importAllAugmentImages = (requireContext) => {
  const images = {};
  requireContext.keys().forEach((key) => {
    const filename = key.replace("./", "").replace(/\.(png|jpe?g|svg)$/, "");
    images[filename] = requireContext(key).default;
  });
  return images;
};

const augmentImages = importAllAugmentImages(
  require.context("./assets/traits", false, /\.(png|jpe?g|svg)$/)
);

const StreamerPage = ({ usernameTagline }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_ENDPOINT =
    // "https://streamertracker-tft-262334a34d5b.herokuapp.com//api/match-history";
    "http://127.0.0.1:5000///api/match-history";
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
      <section className="streamer-intro-section">
        <h1 className="streamer-section-header">Intro Section for Streamer</h1>
      </section>
      <section className="streamer-statistics">
        <h1 className="streamer-section-header">
          Recent 20 Games Ranked Statistics
        </h1>
      </section>

      <h1 className="streamer-section-header">
        {usernameTagline}'s Match History
      </h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {data && (
        <MatchHistory
          data={data}
          champ_images={champ_images}
          item_images={item_images}
          augmentImages={augmentImages}
          usernameTagline={usernameTagline}
        />
      )}
    </div>
  );
};

export default StreamerPage;
