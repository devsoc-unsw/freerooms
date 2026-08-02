"use client";

import { Suspense } from "react";

import { Map } from "../../components/Map";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Map />
    </Suspense>
  );
}
