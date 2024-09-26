"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import React from "react";

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

	return (
		<div>
			{/* hero section */}
			<section className={styles.hero}>
				<h1>Welcome to TFT Streamer Tracker</h1>
				<p>Track your favorite TFT streamers' latest matches and comps!</p>
				<Link href="/streamers" className={styles.ctaButton}>
					Explore Streamers
				</Link>
			</section>

			{/* featured streamers */}
			<section className={styles.featuredStreamers}>
				<h2>Streamers You Can Track</h2>
				<div className={styles.streamerGrid}>
					{streamers.map((streamer) => (
						<div className={styles.streamerCard} key={streamer.id}>
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

			{/* tft data */}
			<section className={styles.trending}>
				<h2>Trending TFT Comps & Augments</h2>
				<div className={styles.trendingGrid}>
					<div className={styles.compCard}>
						<h4>Vanguard Warwick</h4>
						<p>Win Rate: 58%</p>
						<Image
							src="/comp-image.jpg"
							alt="Vanguard Warwick"
							width={100}
							height={100}
						/>
					</div>
				</div>
			</section>

			{/* recent matches */}
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
