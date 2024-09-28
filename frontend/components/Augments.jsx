import React from "react";
import "./styles/Augments.scss";

const Augments = ({ augments }) => {
	return (
		<div className="augments-section">
			<h3>Augments</h3>
			<div className="augments-grid">
				{augments && augments.length > 0 ? (
					augments.map((augment, index) => (
						<div key={index} className="augment-item">
							{augment}
						</div>
					))
				) : (
					<p>No augments available</p>
				)}
			</div>
		</div>
	);
};

export default Augments;
