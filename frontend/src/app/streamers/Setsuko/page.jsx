"use client";
import React from "react";
import StreamerPage from "../../../../components/StreamerPage";

const page = () => {
	const setsukoData = {
		name: "Setsuko",
		image: "/setsuko.png",
		bio: "Setsuko is a high-ranked TFT streamer known for his Challenger-level gameplay and clutch moments.",
		augments: ["Augment 1", "Augment 2", "Augment 3"],
		comps: ["Comp 1", "Comp 2", "Comp 3"],
		items: ["Item 1", "Item 2", "Item 3"],
		placements: ["1st place", "2nd place", "3rd place"],
		matchHistory: ["Match 1", "Match 2", "Match 3"],
	};
	return (
		<>
			<StreamerPage usernameTagline="VIT setsuko #NA2"/>
		</>
	);
};

export default page;
