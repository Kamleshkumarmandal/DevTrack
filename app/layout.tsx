import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevTrack — Project Management & Team Collaboration Platform",
  description: "A focused workspace to plan projects, coordinate teams, manage tasks and move delivery forward."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
