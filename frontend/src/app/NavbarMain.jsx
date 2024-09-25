import React from "react";
import "./NavbarMain.scss";
import Link from "next/link";

const NavbarMain = () => {
	return (
		<nav className="navbar">
			<div className="navbar-container">
				<ul>
					<Link className="nav-label-left" href="/">
						LOGO Streamer Tracker TFT
					</Link>
				</ul>
				<ul className="navbar-menu">
					<li>
						<Link href="/">About</Link>
					</li>
					<li>
						<Link href="/streamers">Streamers</Link>
					</li>
					<li>
						<Link href="/streamers/Dishsoap">Dishsoap</Link>
					</li>

					<li>
						<Link href="/streamers/Setsuko">Setsuko</Link>
					</li>

					<li>
						<Link href="/streamers/soju">K3Loser</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
};

export default NavbarMain;
