import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DESCRIPTION =
  "Drop-in animated hero sections, shader backgrounds, and interactive 3D scenes for React. Copy, paste, ship.";

export const metadata: Metadata = {
  // TODO: replace with final domain once decided (jhinity.com vs .dev)
  metadataBase: new URL("https://jhinity.dev"),
  title: {
    default: "Jhinity — Premium 3D React components for SaaS",
    template: "%s · Jhinity",
  },
  description: DESCRIPTION,
  openGraph: {
    title: "Jhinity — Premium 3D React components for SaaS",
    description: DESCRIPTION,
    type: "website",
    siteName: "Jhinity",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jhinity — Premium 3D React components for SaaS",
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
