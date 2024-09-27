import React from "react";
import Augments from "./Augments";
import Comps from "./Comps";
import Items from "./Items";
import Placements from "./Placements";
import MatchHistory from "./MatchHistory";
import "./styles/StreamerPage.scss";

const StreamerPage = ({ streamer }) => {
	return (
		<div className="streamer-page">
			<div className="header-section">
				<h1>{streamer.name}</h1>
				<img
					src={streamer.image}
					alt={streamer.name}
					className="streamer-img"
				/>
				<p>{streamer.bio}</p>
			</div>

			<div className="data-sections">
				<MatchHistory matchHistory={streamer.matchHistory} />
				<Augments augments={streamer.augments} />
				<Comps comps={streamer.comps} />
				<Items items={streamer.items} />
				<Placements placements={streamer.placements} />
			</div>
		</div>
	);
};

export default StreamerPage;
