import { randomInt } from "node:crypto";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

import FeedbackNotification from "@frontend/components/feedback/FeedbackNotification";
import Landing from "@frontend/components/landing/Landing";
import { connection } from "next/server";

export default async function Home() {
  // Render for each request
  await connection();

  const photoDir = join(process.cwd(), "public", "assets", "building_photos");

  const photos = (await readdir(photoDir)).filter((name) =>
    /^K-[A-Z]\d+\.webp$/.test(name)
  );

  if (photos.length === 0) {
    throw new Error("No building photos found");
  }

  const selectedPhoto = photos[randomInt(photos.length)];
  const heroImageSrc = `/assets/building_photos/${selectedPhoto}`;

  return (
    <>
      <FeedbackNotification />
      <Landing heroImageSrc={heroImageSrc} />
    </>
  );
}
