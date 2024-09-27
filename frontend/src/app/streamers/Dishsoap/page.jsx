import React from "react";
import StreamerPage from "../../../../components/StreamerPage";

const page = () => {
	const dishsoapData = {
		name: "Dishsoap",
		image: "/dishsoap.png",
		bio: "One of the top TFT streamers, consistently ranking Challenger.",
		augments: ["Augment 1", "Augment 2", "Augment 3"],
		comps: ["Comp 1", "Comp 2", "Comp 3"],
		items: ["Item 1", "Item 2", "Item 3"],
		placements: ["1st place", "2nd place", "3rd place"],
		matchHistory: ["Match 1", "Match 2", "Match 3"],
	};
	return (
		<>
			<h1>DishSoap Page</h1>
			<StreamerPage streamer={dishsoapData} />;
		</>
	);
};

export default page;
