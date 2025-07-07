"use client";

import dynamic from "next/dynamic";
const Map = dynamic(
  () => import("../../components/Map").then((mod) => mod.MapComponent),
  {
    ssr: false,
  }
);

export default function Page() {
  return <Map />;
}
