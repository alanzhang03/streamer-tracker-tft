import "./globals.css";
import NavbarMain from "./NavbarMain";
import Script from "next/script";
import Analytics from "./Analytics";

const GA_ID = "G-WBR5ZFTMZF";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());
							gtag('config', '${GA_ID}', { page_path: window.location.pathname });
						`,
          }}
        />
      </head>
      <body>
        <NavbarMain />
        <Analytics />
        <main>{children}</main>
        <footer className="global-footer">
          <div className="footer-inner">
            <div className="footer-brand">
              <span className="footer-logo">Streamer Tracker TFT</span>
              <p className="footer-tagline">Track your favorite TFT streamers in real time.</p>
            </div>
            <div className="footer-links">
              <span className="footer-col-label">Pages</span>
              <a href="/">Home</a>
              <a href="/streamers/Dishsoap">Dishsoap</a>
              <a href="/streamers/Setsuko">Setsuko</a>
              <a href="/streamers/K3soju">K3soju</a>
              <a href="/streamers/Mortdog">Mortdog</a>
            </div>
            <div className="footer-links">
              <span className="footer-col-label">Resources</span>
              <a href="https://www.twitch.tv" target="_blank" rel="noopener noreferrer">Twitch</a>
              <a href="https://tactics.tools" target="_blank" rel="noopener noreferrer">Tactics.tools</a>
              <a href="https://lolchess.gg" target="_blank" rel="noopener noreferrer">lolchess.gg</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Streamer Tracker TFT — Not affiliated with Riot Games.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
