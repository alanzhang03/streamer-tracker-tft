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
          <p>© 2024 Streamer Tracker TFT</p>
        </footer>
      </body>
    </html>
  );
}
