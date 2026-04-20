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

export const metadata: Metadata = {
  title: "DisasterShield — Real-time Landslide Risk Monitoring",
  description:
    "Monitor swarm robots deployed for landslide risk detection with real-time telemetry, risk scoring, and interactive maps.",
  keywords: ["landslide", "monitoring", "swarm robots", "risk detection", "IoT", "dashboard"],
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
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#0b1121" />
      </head>
      <body className="min-h-full flex flex-col bg-[#0b1121]">{children}</body>
    </html>
  );
}
