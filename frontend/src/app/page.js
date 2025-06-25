"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const streamers = [
    {
      id: "Dishsoap",
      name: "Dishsoap",
      rank: "Challenger",
      image: "/dishsoap.png",
    },
    {
      id: "Setsuko",
      name: "Setsuko",
      rank: "Challenger",
      image: "/setsuko.png",
    },
    {
      id: "K3soju",
      name: "K3soju",
      rank: "Challenger",
      image: "/k3soju.png",
    },
    {
      id: "Mortdog",
      name: "Mortdog",
      rank: "Grandmaster",
      image: "/mortdog.png",
    },
  ];

  const FAV_COMPS_API_ENDPOINT =
    "https://streamertracker-tft-262334a34d5b.herokuapp.com//api/favorite-comps";
  // "http://127.0.0.1:5000///api/favorite-comps";
  const k3soju_fav_comps_headers = {
    "Content-Type": "application/json",
    "username-tagline": "VIT k3soju #000",
  };
  const setsuko_fav_comps_headers = {
    "Content-Type": "application/json",
    "username-tagline": "VIT setsuko #NA2",
  };
  const dishsoap_fav_comps_headers = {
    "Content-Type": "application/json",
    "username-tagline": "100T Dishsoap #NA2",
  };
  const mortdog_fav_comps_headers = {
    "Content-Type": "application/json",
    "username-tagline": "Riot Mortdog #Mort",
  };

  const [sojuComps, setSojuComps] = useState(null);
  const [setsukoComps, setSetsukoComps] = useState(null);
  const [dishsoapComps, setDishsoapComps] = useState(null);
  const [mortdogComps, setMortdogComps] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useGSAP(() => {
    gsap.from("#hero-title", {
      delay: 0.5,
      y: -150,
      opacity: 0,
      duration: 1,
    });
    gsap.from("#hero-text", {
      delay: 1,
      y: 50,
      opacity: 0,
      duration: 1,
    });
    gsap.to("#hero-explore-streamers-button", {
      delay: 1.25,
      opacity: 1,
      duration: 0.75,
    });
    gsap.to(".streamerCard", {
      scrollTrigger: ".streamerCard",
      delay: 0.25,
      opacity: 1,
      duration: 1,
      stagger: {
        each: 0.175,
        from: "start",
      },
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch K3soju data
        const response = await fetch(FAV_COMPS_API_ENDPOINT, {
          method: "GET",
          headers: k3soju_fav_comps_headers,
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        setSojuComps(result);

        // Fetch Setsuko data
        const stats_response = await fetch(FAV_COMPS_API_ENDPOINT, {
          method: "GET",
          headers: setsuko_fav_comps_headers,
        });
        if (!stats_response.ok) {
          throw new Error(`Error: ${stats_response.status}`);
        }
        const stas_res = await stats_response.json();
        setSetsukoComps(stas_res);

        // Fetch Dishsoap data
        const fav_comps_response = await fetch(FAV_COMPS_API_ENDPOINT, {
          method: "GET",
          headers: dishsoap_fav_comps_headers,
        });
        if (!fav_comps_response.ok) {
          throw new Error(`Error: ${fav_comps_response.status}`);
        }
        const fav_comps_res = await fav_comps_response.json();
        setDishsoapComps(fav_comps_res);

        // Fetch Mortdog data
        const mortdog_response = await fetch(FAV_COMPS_API_ENDPOINT, {
          method: "GET",
          headers: mortdog_fav_comps_headers,
        });
        if (!mortdog_response.ok) {
          throw new Error(`Error: ${mortdog_response.status}`);
        }
        const mortdog_res = await mortdog_response.json();
        setMortdogComps(mortdog_res);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Hero section */}
      <section className={styles.hero}>
        <h1 id="hero-title">Welcome to TFT Streamer Tracker</h1>
        <p id="hero-text">
          Track your favorite TFT streamers' latest matches and comps!
        </p>
        {/* <p>(Still in Production)</p> */}
        <Link
          id="hero-explore-streamers-button"
          href="#streamers"
          className={styles.ctaButton}
        >
          Explore Streamers
        </Link>
      </section>

      {/* Featured streamers */}
      <section id="streamers" className={styles.featuredStreamers}>
        <h2>Streamers You Can Track</h2>
        <div className={styles.streamerGrid}>
          {streamers.map((streamer) => (
            <div
              className={`${styles.streamerCard} streamerCard`}
              key={streamer.id}
            >
              <Image
                src={streamer.image}
                alt={streamer.name}
                width={200}
                height={200}
              />
              <h3 className={styles.streamerName}>{streamer.name}</h3>
              {/* <p className={styles.streamerRank}>Rank: {streamer.rank}</p> */}
              <Link
                href={`/streamers/${streamer.id}`}
                className={styles.viewProfile}
              >
                View Matches
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Trending TFT Data */}
      <section className={styles.trending}>
        <h2>Streamer Favorites</h2>
        <div className={styles.trendingGrid}>
          <div className={styles.compCard}>
            <Image
              src="/dishsoap.png"
              alt="Dishsoap"
              width={100}
              height={100}
            />
            {loading && <p>loading</p>}
            {dishsoapComps &&
              dishsoapComps.map((comp, index) => {
                return (
                  <div className={styles.favCompElement} key={index}>
                    <p>{comp.join(" ")}</p>
                  </div>
                );
              })}
          </div>
          <div className={styles.compCard}>
            <Image src="/setsuko.png" alt="Setsuko" width={100} height={100} />
            {loading && <p>loading</p>}
            {setsukoComps &&
              setsukoComps.map((comp, index) => {
                return (
                  <div className={styles.favCompElement} key={index}>
                    <p>{comp.join(" ")}</p>
                  </div>
                );
              })}
          </div>
          <div className={styles.compCard}>
            <Image src="/k3soju.png" alt="K3Soju" width={100} height={100} />
            {loading && <p>loading</p>}
            {sojuComps &&
              sojuComps.map((comp, index) => {
                return (
                  <div className={styles.favCompElement} key={index}>
                    <p>{comp.join(" ")}</p>
                  </div>
                );
              })}
          </div>
          {/* <div className={styles.compCard}>
            <Image
              src="/mortdog.png"
              alt="Riot Mortdog"
              width={100}
              height={100}
            />
            {loading && <p>loading</p>}
            {mortdogComps &&
              mortdogComps.map((comp, index) => {
                return (
                  <div className={styles.favCompElement} key={index}>
                    <p>{comp.join(" ")}</p>
                  </div>
                );
              })}
          </div> */}
        </div>
      </section>

      {/* Recent matches */}
      {/* <section className={styles.recentMatches}>
        <h2>Recent Matches</h2>
        <p>(example data)</p>
        <ul>
          <li>
            <Link href="/">Dishsoap won with Challenger Jinx - 1st place</Link>
          </li>
        </ul>
      </section> */}
    </div>
  );
}
