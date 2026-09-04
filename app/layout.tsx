import type { Metadata, Viewport } from "next";
import {
  Yatra_One,
  Gentium_Book_Plus,
  Kalam,
  Tiro_Devanagari_Sanskrit,
} from "next/font/google";
import "./globals.css";
import { PaperGrain } from "@/components/chrome/PaperGrain";
import { NibCursor } from "@/components/chrome/NibCursor";
import { ServiceWorker } from "@/components/chrome/ServiceWorker";
import { Motion } from "@/components/chrome/Motion";

const display = Yatra_One({
  weight: "400",
  subsets: ["latin", "devanagari"],
  variable: "--font-display",
  display: "swap",
});

const body = Gentium_Book_Plus({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const hand = Kalam({
  weight: ["300", "400"],
  subsets: ["latin", "devanagari"],
  variable: "--font-hand",
  display: "swap",
});

const deva = Tiro_Devanagari_Sanskrit({
  weight: "400",
  subsets: ["devanagari", "latin"],
  variable: "--font-deva",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BHARATVERSE — The Lost Library of Nalanda",
  description:
    "It is 1202 CE. Khalji's forces are three days out. You are the last scribe on duty in the manuscript hall of Nalanda. What you save tonight is what history gets to keep.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#1B1712",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} ${hand.variable} ${deva.variable} min-h-screen antialiased`}
      >
        <Motion>{children}</Motion>
        <PaperGrain />
        <NibCursor />
        <ServiceWorker />
      </body>
    </html>
  );
}
