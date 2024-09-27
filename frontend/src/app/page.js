"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import React, { useEffect } from "react";
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
			id: "anotherstreamer",
			name: "AnotherStreamer",
			rank: "Diamond",
			image: "",
		},
	];

	useGSAP(() => {
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

	return (
		<div>
			{/* Hero section */}
			<section className={styles.hero}>
				<h1>Welcome to TFT Streamer Tracker</h1>
				<p>Track your favorite TFT streamers' latest matches and comps!</p>
				<Link href="/streamers" className={styles.ctaButton}>
					Explore Streamers
				</Link>
			</section>

			{/* Featured streamers */}
			<section className={styles.featuredStreamers}>
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
							<p className={styles.streamerRank}>Rank: {streamer.rank}</p>
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
				<h2>Trending TFT Comps & Augments</h2>
				<div className={styles.trendingGrid}>
					<div className={styles.compCard}>
						<h4>Vanguard Warwick</h4>
						<p>Win Rate: 58%</p>
						<Image
							src="/k3soju.png"
							alt="Vanguard Warwick"
							width={100}
							height={100}
						/>
					</div>
				</div>
			</section>

			{/* Recent matches */}
			<section className={styles.recentMatches}>
				<h2>Recent Matches</h2>
				<ul>
					<li>
						<Link href="/matches/1">
							Dishsoap won with Challenger Jinx - 1st place
						</Link>
					</li>
				</ul>
			</section>
		</div>
	);
}
