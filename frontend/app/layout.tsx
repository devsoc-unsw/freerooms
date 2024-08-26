import "../styles/globals.css";

import { Metadata } from "next";
import React from "react";

import ClientLayout from "./clientLayout";

/**
 * Metadata in head is generated here
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Freerooms",
    description: "A tool to aid UNSW students in finding vacant rooms.",
  };
}

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
