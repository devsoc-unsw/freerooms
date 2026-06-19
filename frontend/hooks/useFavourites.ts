"use client";

import { useCallback, useSyncExternalStore } from "react";

// Caches last parsed favourites to avoid re-parsing identical arrays (which would create a duplicate array with different reference).
// JS compares by reference rather than contents of array.
let lastStoredFavourites: string | null = null;
let lastParsedFavourites: string[] = [];

const subscribeToFavourites = (callback: () => void) => {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === "favourite") {
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener("storage", handleStorage);
  };
};

const getClientFavouriteSnapshot = (): string[] => {
  const storedFavourites = window.localStorage.getItem("favourite");

  // Ensuring JSON.parse does not create a new array each call.
  if (storedFavourites === lastStoredFavourites) {
    return lastParsedFavourites;
  }

  lastStoredFavourites = storedFavourites;
  lastParsedFavourites = storedFavourites ? JSON.parse(storedFavourites) : [];

  return lastParsedFavourites;
};

const getServerFavouriteSnapshot = (): string[] => [];

export default function useFavourites() {
  const favourites = useSyncExternalStore(
    subscribeToFavourites,
    getClientFavouriteSnapshot,
    getServerFavouriteSnapshot
  );

  const isFavourite = (roomId: string) => {
    return favourites.includes(roomId);
  };

  const toggleFavourite = useCallback(
    (roomId: string) => {
      const nextFavourites = favourites.includes(roomId)
        ? favourites.filter((id) => id !== roomId)
        : [...favourites, roomId];
      const nextValue = JSON.stringify(nextFavourites);

      window.localStorage.setItem("favourite", nextValue);
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "favourite",
          newValue: nextValue,
        })
      );
    },
    [favourites]
  );

  return {
    favourites,
    isFavourite,
    toggleFavourite,
  };
}
