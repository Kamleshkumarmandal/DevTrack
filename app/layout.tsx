"use client";

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevTrack — Work, clearly in motion",
  description: "A calm, focused workspace for projects, teams, and tasks."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}