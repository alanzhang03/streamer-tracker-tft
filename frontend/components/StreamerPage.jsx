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

const StreamerPage = ({ usernameTagline, username, displayName }) => {
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [favComps, setFavComps] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComps, setSelectedComps] = useState(new Set());
  const [filteredData, setFilteredData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [recentStatistics, setRecentStatistics] = useState(null);

  const updateRecentStatistics = () => {
    let recentMatches;
    if (filteredData) {
      recentMatches = filteredData.slice(0, 20);
    } else {
      recentMatches = data.slice(0, 20);
    }

    let placement_sum = 0;
    let wins = 0;
    let games = 0;
    let lp = 0;
    recentMatches.forEach((match) => {
      const player = Object.values(match).find(
        (p) => p.username_tagline === usernameTagline
      );
      games += 1;
      placement_sum += player.placement;
      if (player.placement == 1) {
        wins += 1;
      }
      lp += player.lp_gain;
    });
    const recentStatsObject = {
      average_placement: placement_sum / games,
      games: games,
      lp_gain: lp,
      wins: wins,
    };
    setRecentStatistics(recentStatsObject);
    console.log("Hello");
  };

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

      const last_updated_response = await fetch(LAST_UPDATE_API_ENDPOINT, {
        method: "GET",
        headers: last_update_headers,
      });
      if (!last_updated_response.ok) {
        throw new Error(`Error: ${last_updated_response.status}`);
      }
      const last_updated_res = await last_updated_response.json();
      setLastUpdated(last_updated_res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateData = async () => {
    try {
      const response = await fetch(UPDATE_API_ENDPOINT, {
        method: "POST",
        headers: update_headers,
      });
      const res = await response.json();
      console.log(res);
    } catch (err) {
      setError(err.message);
    } finally {
      fetchData();
    }
  };

  const getTimeAgo = (timestamp) => {
    const matchDate = new Date(timestamp);
    const now = new Date();
    const differenceInTime = now - matchDate;
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

    if (differenceInDays < 1) {
      const differenceInHours = Math.floor(differenceInTime / (1000 * 3600));
      if (differenceInHours < 1) {
        const differenceInMinutes = Math.floor(differenceInTime / (1000 * 60));
        return differenceInMinutes <= 1
          ? "Just now"
          : `${differenceInMinutes} minutes ago`;
      }
      return `${differenceInHours} hours ago`;
    }
    if (differenceInDays == 1) {
      return `${differenceInDays} day ago`;
    }
    return `${differenceInDays} days ago`;
  };

  function determineColor(placement) {
    switch (placement) {
      case 1:
        return "#F1C555";
      case 2:
        return "#DC38C3";
      case 3:
        return "#6ECCFF";
      case 4:
        return "#37D488";
      // case 8:
      //   return "#cc0c26"
      default:
        return "#8f000e";
    }
  }

  const API_ENDPOINT =
    "https://streamertracker-tft-262334a34d5b.herokuapp.com/api/match-history";
    // "http://127.0.0.1:5000/api/match-history";
  const headers = {
    "Content-Type": "application/json",
    // "page-number": "0",
    "username-tagline": usernameTagline,
  };

  const STATS_API_ENDPOINT =
    "https://streamertracker-tft-262334a34d5b.herokuapp.com/api/stats";
    // "http://127.0.0.1:5000/api/stats";
  const stats_headers = {
    "Content-Type": "application/json",
    "username-tagline": usernameTagline,
  };

  const FAV_COMPS_API_ENDPOINT =
    "https://streamertracker-tft-262334a34d5b.herokuapp.com/api/favorite-comps";
    // "http://127.0.0.1:5000/api/favorite-comps";
  const fav_comps_headers = {
    "Content-Type": "application/json",
    "username-tagline": usernameTagline,
  };
  const UPDATE_API_ENDPOINT =
    "https://streamertracker-tft-262334a34d5b.herokuapp.com/api/update-data";
    // "http://127.0.0.1:5000/api/update-data";
  const update_headers = {
    "Content-Type": "application/json",
    "username-tagline": usernameTagline,
  };
  const LAST_UPDATE_API_ENDPOINT =
    "https://streamertracker-tft-262334a34d5b.herokuapp.com/api/last-updated";
    // "http://127.0.0.1:5000/api/last-updated";
  const last_update_headers = {
    "Content-Type": "application/json",
    "username-tagline": usernameTagline,
  };

  useEffect(() => {
    fetchData();
  }, [usernameTagline]);

  useEffect(() => {
    if (!data) return;

    if (selectedComps.size === 0) {
      setFilteredData(data);
    } else {
      const selected = [...selectedComps][0]; // unwrap inner array

      const filtered = data.filter((match) => {
        const player = Object.values(match).find(
          (p) => p.username_tagline === usernameTagline
        );

        if (!player || !Array.isArray(player.comp)) return false;

        return selected.every((trait) =>
          player.comp.some((c) => c.includes(trait))
        );
      });

      setFilteredData(filtered);
    }
  }, [selectedComps, data]);

  useEffect(() => {
    if (filteredData) {
      updateRecentStatistics();
    }
  }, [filteredData]);

  return (
    <div className="streamer-page">
      <div className="streamer-stats">
        <div className="streamer-header-intro-image-container">
          {" "}
          <h2 style={{ marginBottom: "-40px" }}>{displayName}</h2>
          {username && (
            <Image
              src={`/${username}.png`}
              alt={username}
              width={200}
              height={200}
              style={{
                borderRadius:"25px",
                border:"1px solid #ccc"
              }}
            />
          )}
        </div>
        <h2>
          {stats &&
            stats.tier.charAt(0).toUpperCase() +
              stats.tier.slice(1).toLowerCase()}
        </h2>
        
        {stats && (
          <Image
            src={rank_images[stats.tier + ".png"]}
            alt={stats.tier}
            width={200}
            height={200}
          />
        )}
        <button
          onClick={updateData}
          className="update-button"
          disabled={
            loading ||
            (lastUpdated && new Date() - new Date(lastUpdated) < 2 * 60 * 1000)
          }
        >
          Update Data
          <br />
          <span className="last-updated-timestamp">
            Last updated: {loading ? "loading..." : getTimeAgo(lastUpdated)}
          </span>
        </button>
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
            {displayName}'s Favorite Comps
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
          {displayName}'s Match History
        </h1>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {recentStatistics && filteredData && (
          <div className="summary-card">
            <p className="last-20-text">Last 20 Games</p>
            <div className="summary-section">
              <div className="recent-match-container">
                {filteredData.slice(0, 20).map((match, index) => {
                  const player = Object.values(match).find(
                    (p) => p.username_tagline === usernameTagline
                  );
                  return (
                    <div
                      className="recent-match-element"
                      key={index}
                      style={{
                        backgroundColor: determineColor(player.placement),
                      }}
                    >
                      {player.placement}
                    </div>
                  );
                })}
              </div>
              <div className="recent-stats">
                <p>games: {recentStatistics.games}</p>
                <p>lp: {recentStatistics.lp_gain}</p>
                <p>avg: {recentStatistics.average_placement}</p>
                <p>wins: {recentStatistics.wins}</p>
              </div>
            </div>
          </div>
        )}
        {filteredData && (
          <MatchHistory
            className="match-history"
            data={filteredData}
            champ_images={champ_images}
            item_images={item_images}
            augmentImages={augmentImages}
            usernameTagline={usernameTagline}
            getTimeAgo={getTimeAgo}
            determineColor={determineColor}
          />
        )}
      </div>
    </div>
  );
};

export default StreamerPage;
