import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GTA VI Companion Map — Leonida Interactive GIS",
  description: "Premium interactive gaming companion map for GTA VI on Xbox Series X and PC. Explore Leonida, track non-tracker vehicles, find high-value money opportunities, and optimize routes.",
  authors: [{ name: "GTA VI Companion Team" }],
  keywords: ["GTA 6", "GTA VI", "Leonida Map", "Companion", "Interactive Map", "Vice City", "Vehicles", "Money Finder", "Xbox Series X"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#080d1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen bg-[#080d1a] text-slate-100 antialiased selection:bg-[#ff007a] selection:text-white">
        {children}
      </body>
    </html>
  );
}
