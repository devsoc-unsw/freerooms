"use client";

import { useCallback, useSyncExternalStore } from "react";

// Caches last parsed bookmarks to avoid re-parsing identical arrays (which would create a duplicate array with different reference).
// JS compares by reference rather than contents of array.
let lastStoredBookmarks: string | null = null;
let lastParsedBookmarks: string[] = [];

const subscribeToBookmarks = (callback: () => void) => {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === "bookmark") {
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener("storage", handleStorage);
  };
};

const getClientBookmarkSnapshot = (): string[] => {
  const storedBookmarks = window.localStorage.getItem("bookmark");
  
  // Ensuring JSON.parse does not create a new array each call.
  if (storedBookmarks === lastStoredBookmarks) {
    return lastParsedBookmarks;
  }

  lastStoredBookmarks = storedBookmarks;
  lastParsedBookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : [];

  return lastParsedBookmarks;
};

const getServerBookmarkSnapshot = (): string[] => [];

export default function useBookmarks() {
  const bookmarks = useSyncExternalStore(
    subscribeToBookmarks,
    getClientBookmarkSnapshot,
    getServerBookmarkSnapshot
  );

  const isBookmarked = (roomId: string) => {
    return bookmarks.includes(roomId);
  };

  const toggleBookmark = useCallback((roomId: string) => {
    const nextBookmarks = bookmarks.includes(roomId) ? bookmarks.filter((id) => id !== roomId) : [...bookmarks, roomId];
    const nextValue = JSON.stringify(nextBookmarks)

    window.localStorage.setItem("bookmark", nextValue);
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "bookmark",
        newValue: nextValue
      })
    );
  }, [bookmarks]);

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
  };
}
