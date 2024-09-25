import "./globals.css";
import NavbarMain from "./NavbarMain";

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<NavbarMain />
				<main>{children}</main>
				<footer className="global-footer">
					<p>© 2024 Streamer Tracker TFT</p>
				</footer>
			</body>
		</html>
	);
}
