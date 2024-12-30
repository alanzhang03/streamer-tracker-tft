import React from "react";


const Placements = ({ placements }) => {
	return (
		<div className="placements-section">
			<h3>Placements</h3>
			<div className="placements-grid">
				{placements && placements.length > 0 ? (
					placements.map((placement, index) => (
						<div key={index} className="placement">
							{placement}
						</div>
					))
				) : (
					<p>No placements available</p>
				)}
			</div>
		</div>
	);
};

export default Placements;
