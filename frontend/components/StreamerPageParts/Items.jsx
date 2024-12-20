import React from "react";
import "./styles/Items.scss";

const Items = ({ items }) => {
	return (
		<div className="items-section">
			<h3>Items</h3>
			<div className="items-grid">
				{items && items.length > 0 ? (
					items.map((item, index) => (
						<div key={index} className="item">
							{item}
						</div>
					))
				) : (
					<p>No items available</p>
				)}
			</div>
		</div>
	);
};

export default Items;
