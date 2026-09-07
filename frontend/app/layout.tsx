import { DM_Sans } from "next/font/google";
import "mapbox-gl/dist/mapbox-gl.css";
import "../styles/globals.css";

import { Metadata } from "next";
import React from "react";

import ClientLayout from "./clientLayout";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Freerooms",
  description: "A tool to aid UNSW students in finding vacant rooms.",
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={dmSans.variable}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
