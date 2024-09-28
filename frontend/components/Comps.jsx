import React from "react";
import "./styles/Comps.scss";

const Comps = ({ comps }) => {
	return (
		<div className="comps-section">
			<h3>Comps</h3>
			<div className="comps-grid">
				{comps && comps.length > 0 ? (
					comps.map((comp, index) => (
						<div key={index} className="comp">
							{comp}
						</div>
					))
				) : (
					<p>No comps available</p>
				)}
			</div>
		</div>
	);
};

export default Comps;
