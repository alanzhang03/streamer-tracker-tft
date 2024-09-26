import "./globals.css";
import NavbarMain from "./NavbarMain";

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				<link
					href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
					rel="stylesheet"
				/>
			</head>
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
