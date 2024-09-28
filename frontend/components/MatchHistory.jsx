import React from "react";
import "./styles/MatchHistory.scss";

const MatchHistory = ({ matchHistory = [] }) => {
	return (
		<div className="match-history">
			<h3>Match History</h3>
			<ul>
				{matchHistory.length > 0 ? (
					matchHistory.map((match, index) => (
						<li key={index} className="match-item">
							{match}
						</li>
					))
				) : (
					<li className="match-item">No match history available</li>
				)}
			</ul>
		</div>
	);
};

export default MatchHistory;
