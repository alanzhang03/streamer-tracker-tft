import React, { useEffect, useState } from "react";
import "./styles/StreamerPage.scss";
import MatchHistory from "./StreamerPageParts/MatchHistory";
import Stats from "./StreamerPageParts/Stats";
import Image from "next/image";
import { useDeprecatedAnimatedState } from "framer-motion";
import FavoriteComps from "./StreamerPageParts/FavoriteComps";

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

const rank_images = importAllImages(
  require.context("./assets/ranks", false, /\.(png|jpe?g|svg)$/)
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
  const [stats, setStats] = useState(null);
  const [favComps, setFavComps] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComps, setSelectedComps] = useState(new Set());
  const [filteredData, setFilteredData] = useState(null);

const handleCompClick = (compName) => {
  setSelectedComps((prev) => {
    const newSet = new Set(prev);
    if (newSet.has(compName)) {
      newSet.delete(compName);
    } else {
      newSet.add(compName);
    }
    return newSet;
  });
};

  const API_ENDPOINT =
    "https://streamertracker-tft-262334a34d5b.herokuapp.com//api/match-history";
    // "http://127.0.0.1:5000///api/match-history";
  const headers = {
    "Content-Type": "application/json",
    "page-number": "0",
    "username-tagline": usernameTagline,
  };

  const STATS_API_ENDPOINT =
    "https://streamertracker-tft-262334a34d5b.herokuapp.com//api/stats";
    // "http://127.0.0.1:5000///api/stats";
  const stats_headers = {
    "Content-Type": "application/json",
    "username-tagline": usernameTagline,
  };

  const FAV_COMPS_API_ENDPOINT =
    "https://streamertracker-tft-262334a34d5b.herokuapp.com//api/favorite-comps";
    // "http://127.0.0.1:5000///api/favorite-comps";
  const fav_comps_headers = {
    "Content-Type": "application/json",
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
        setFilteredData(result);

        const stats_response = await fetch(STATS_API_ENDPOINT, {
          method: "GET",
          headers: stats_headers,
        });
        if (!stats_response.ok) {
          throw new Error(`Error: ${stats_response.status}`);
        }
        const stas_res = await stats_response.json();
        setStats(stas_res);

        const fav_comps_response = await fetch(FAV_COMPS_API_ENDPOINT, {
          method: "GET",
          headers: fav_comps_headers,
        });
        if (!fav_comps_response.ok) {
          throw new Error(`Error: ${fav_comps_response.status}`);
        }
        const fav_comps_res = await fav_comps_response.json();
        setFavComps(fav_comps_res);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [usernameTagline]);


  useEffect(() => {
    if (!data) return;
  
    if (selectedComps.size === 0) {
      setFilteredData(data);
    } else {
      const filtered = data.filter((match) => {
        const player = Object.values(match).find(
          (p) => p.username_tagline === usernameTagline
        );
      
        if (!player) return false;
      
        if (selectedComps.size === 0) return true;
      
        return (
          Array.isArray(player.comp) &&
          player.comp.some((trait) => selectedComps.has(trait))
        );
      });
      setFilteredData(filtered);
    }
  }, [selectedComps, data]);

  return (
    <div className="streamer-page">
      <div className="streamer-stats">
        <h2>
          {stats && stats.tier.charAt(0).toUpperCase() + stats.tier.slice(1).toLowerCase()}
        </h2>
        {stats && <Image src={rank_images[stats.tier + ".png"]} alt={stats.tier} width={200} height={200} />}
        {stats && <Stats stats={stats} />}
      </div>
      <div className="streamer-main-section">
        <section className="streamer-intro-section">
          {/* <h1 className="streamer-section-header">
            Intro Section for Streamer
          </h1> */}
        </section>
        <section className="streamer-statistics">
          {/* <h1 className="streamer-section-header">
            Recent 20 Games Ranked Statistics
          </h1> */}
          <h1 className="streamer-section-header">
            {usernameTagline}'s Top Comps
          </h1>
          <div className="fav-comps-table">
            {favComps && (
              <FavoriteComps
                comps={favComps}
                onCompClick={handleCompClick}
                selectedComps={selectedComps}
              />
            )}
          </div>
        </section>

        <h1 className="streamer-section-header">
          {usernameTagline}'s Match History
        </h1>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {
            filteredData && (
              <MatchHistory
                className="match-history"
                data={filteredData}
                champ_images={champ_images}
                item_images={item_images}
                augmentImages={augmentImages}
                usernameTagline={usernameTagline}
              />)
        }
      </div>
    </div>
  );
};

export default StreamerPage;
