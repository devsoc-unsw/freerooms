"use client";

import { useSyncExternalStore } from "react";

const EMPTY_BOOKMARKS: string[] = [];
const BOOKMARKS_EVENT = "bookmarks_change";
let cacheRaw: string | null = null;
let cacheParsed: string[] = [];

const subscribeBookmarks = (callback: () => void) => {
  window.addEventListener(BOOKMARKS_EVENT, callback);

  return () => {
    window.removeEventListener(BOOKMARKS_EVENT, callback);
  };
};

const getClientBookmarkSnapshot = (): string[] => {
  if (typeof window === "undefined") return EMPTY_BOOKMARKS;
  const stored = window.localStorage.getItem("bookmarks");
  if (stored === cacheRaw) return cacheParsed;
  cacheRaw = stored;
  cacheParsed = stored ? JSON.parse(stored) : [];

  return cacheParsed;
};

const getServerBookmarkSnapshot = (): string[] => EMPTY_BOOKMARKS;

export default function useBookmarks() {
  const bookmarks = useSyncExternalStore(
    subscribeBookmarks,
    getClientBookmarkSnapshot,
    getServerBookmarkSnapshot
  );

  const isBookmarked = (roomId: string) => {
    return bookmarks.includes(roomId);
  };

  const toggleBookmark = (roomId: string) => {
    let nextBookmarks: string[];
    if (isBookmarked(roomId)) {
      nextBookmarks = bookmarks.filter((id) => id !== roomId);
    } else {
      nextBookmarks = [...bookmarks, roomId];
    }

    window.localStorage.setItem("bookmarks", JSON.stringify(nextBookmarks));
    window.dispatchEvent(new Event(BOOKMARKS_EVENT));
  };

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
  };
}
