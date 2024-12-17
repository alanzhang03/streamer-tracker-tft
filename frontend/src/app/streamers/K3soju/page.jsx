"use client";
import React from "react";
import StreamerPage from "../../../../components/StreamerPage";

const page = () => {
	const k3sojuData = {
		name: "K3soju",
		image: "/k3soju.png",
		bio: "K3soju is a popular TFT streamer known for his innovative strategies and top Challenger ranks.",
		augments: ["Augment 1", "Augment 2", "Augment 3"],
		comps: ["Comp 1", "Comp 2", "Comp 3"],
		items: ["Item 1", "Item 2", "Item 3"],
		placements: ["1st place", "2nd place", "3rd place"],
		matchHistory: ["Match 1", "Match 2", "Match 3"],
	};
	return (
		<>
			<StreamerPage usernameTagline="VIT k3soju #000" />
		</>
	);
};

export default page;
