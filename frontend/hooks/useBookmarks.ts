"use client";

import React, {
  createContext,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from "react";
import { Provider as ReduxProvider } from "react-redux";
import store from "../redux/store";

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

  return storedBookmarks ? JSON.parse(storedBookmarks) : [];
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
