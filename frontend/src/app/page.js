'use client';

import Image from 'next/image';
import styles from './page.module.css';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

const FAV_COMPS_API_ENDPOINT =
  'https://streamertracker-tft-262334a34d5b.herokuapp.com/api/favorite-comps';
const TRAIT_ICONS_ENDPOINT =
  'https://streamertracker-tft-262334a34d5b.herokuapp.com/api/trait-icons';

const streamers = [
  {
    id: 'Setsuko',
    name: 'Setsuko',
    rank: 'Challenger',
    image: '/setsuko.png',
    headers: {
      'Content-Type': 'application/json',
      'username-tagline': 'VIT setsuko #NA2',
    },
  },
  {
    id: 'K3soju',
    name: 'K3soju',
    rank: 'Challenger',
    image: '/k3soju.png',
    headers: {
      'Content-Type': 'application/json',
      'username-tagline': 'VIT k3soju #000',
    },
  },
  {
    id: 'Frodan',
    name: 'Frodan',
    rank: 'Challenger',
    image: '/frodan.png',
    headers: {
      'Content-Type': 'application/json',
      'username-tagline': 'ACAD Frodan #FRO',
    },
  },
  {
    id: 'Robinsongz',
    name: 'Robinsongz',
    rank: 'Challenger',
    image: '/robinsongz.png',
    headers: {
      'Content-Type': 'application/json',
      'username-tagline': 'CTG robinsongz #888',
    },
  },
  {
    id: 'Dishsoap',
    name: 'Dishsoap',
    rank: 'Challenger',
    image: '/dishsoap.png',
    headers: {
      'Content-Type': 'application/json',
      'username-tagline': 'ACAD Dishsoap #NA3',
    },
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Data Collection',
    desc: 'Match data is pulled from the Riot Games API after each game and stored in our database.',
  },
  {
    step: '02',
    title: 'Comp Analysis',
    desc: "We analyze placement history to surface each streamer's most-played and highest-performing comps.",
  },
  {
    step: '03',
    title: 'Live Tracking',
    desc: 'Profiles refresh automatically so you always see the latest matches, stats, and trends.',
  },
];

export default function Home() {
  const [compsMap, setCompsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [traitIcons, setTraitIcons] = useState({});

  useGSAP(() => {
    gsap.from('#hero-title', { delay: 0.5, y: -150, opacity: 0, duration: 1 });
    gsap.from('#hero-text', { delay: 1, y: 50, opacity: 0, duration: 1 });
    gsap.to('#hero-explore-streamers-button', {
      delay: 1.25,
      opacity: 1,
      duration: 0.75,
    });
    gsap.to('.streamerCard', {
      scrollTrigger: '.streamerCard',
      delay: 0.25,
      opacity: 1,
      duration: 1,
      stagger: { each: 0.175, from: 'start' },
    });
    gsap.from('.stepCard', {
      scrollTrigger: { trigger: '.stepCard', start: 'top 85%' },
      y: 40,
      opacity: 0,
      duration: 0.7,
      stagger: { each: 0.15, from: 'start' },
    });
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const results = {};
      await Promise.allSettled(
        streamers.map(async (s) => {
          try {
            const res = await fetch(FAV_COMPS_API_ENDPOINT, {
              method: 'GET',
              headers: s.headers,
            });
            if (res.ok) results[s.id] = await res.json();
          } catch (_) {}
        }),
      );
      setCompsMap(results);
      setLoading(false);
    };
    fetchAll();
    fetch(TRAIT_ICONS_ENDPOINT)
      .then((r) => r.json())
      .then(setTraitIcons)
      .catch(() => {});
  }, []);

  return (
    <div>
      <section className={styles.hero}>
        <p className={styles.heroEyebrow}>TFT Streamers Tracker</p>
        <h1 id='hero-title'>
          Streamer Tracker <span>TFT</span>
        </h1>
        <p id='hero-text'>
          Track top TFT streamers. Comps, placements, and tendencies updated
          after every game.
        </p>
        <Link
          id='hero-explore-streamers-button'
          href='#streamers'
          className={styles.ctaButton}
        >
          Explore Streamers
        </Link>
      </section>

      <section id='streamers' className={styles.featuredStreamers}>
        <p className={styles.sectionLabel}>Streamers</p>
        <h2 className={styles.sectionTitle}>Streamers You Can Track</h2>
        <div className={styles.streamerGrid}>
          {streamers.map((streamer) => (
            <Link
              href={`/streamers/${streamer.id}`}
              key={streamer.id}
              className={`${styles.streamerCard} streamerCard`}
            >
              <Image
                src={streamer.image}
                alt={streamer.name}
                width={200}
                height={200}
                className={styles.streamerAvatar}
              />
              <h3 className={styles.streamerName}>{streamer.name}</h3>
              <span className={styles.streamerRankBadge}>{streamer.rank}</span>
              <span className={styles.viewProfile}>View Matches →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.howItWorks}>
        <p className={styles.sectionLabel}>How It Works</p>
        <h2 className={styles.sectionTitle}>From game end to your screen</h2>
        <div className={styles.stepsGrid}>
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className={styles.stepCard}>
              <span className={styles.stepNumber}>{item.step}</span>
              <h3 className={styles.stepTitle}>{item.title}</h3>
              <p className={styles.stepDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.trending}>
        <p className={styles.sectionLabel}>Streamer Favorites</p>
        <h2 className={styles.sectionTitle}>Most played comps this patch</h2>
        <div className={styles.trendingGrid}>
          {streamers.map((streamer) => (
            <div key={streamer.id} className={styles.compCard}>
              <div className={styles.compCardHeader}>
                <Image
                  src={streamer.image}
                  alt={streamer.name}
                  width={44}
                  height={44}
                  className={styles.compCardAvatar}
                />
                <div className={styles.compCardMeta}>
                  <span className={styles.compCardName}>{streamer.name}</span>
                  <span className={styles.compCardRank}>{streamer.rank}</span>
                </div>
                <Link
                  href={`/streamers/${streamer.id}`}
                  className={styles.compCardLink}
                >
                  View →
                </Link>
              </div>

              <div className={styles.compList}>
                {loading && (
                  <>
                    <div className={styles.skeletonComp} />
                    <div className={styles.skeletonComp} />
                    <div className={styles.skeletonComp} />
                  </>
                )}
                {!loading &&
                  (compsMap[streamer.id] === undefined ||
                    compsMap[streamer.id]?.length === 0) && (
                    <p className={styles.emptyComps}>No data yet</p>
                  )}
                {!loading &&
                  compsMap[streamer.id]
                    ?.filter((comp) => comp.length > 0)
                    .map((comp, index) => (
                      <div key={index} className={styles.favCompElement}>
                        <span className={styles.compRank}>{index + 1}</span>
                        <div className={styles.compChips}>
                          {comp.map((trait, i) => (
                            <span key={i} className={styles.chip}>
                              {traitIcons[trait] && (
                                <img
                                  src={traitIcons[trait]}
                                  alt={trait}
                                  className={styles.chipIcon}
                                />
                              )}
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
