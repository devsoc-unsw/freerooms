"use client";

import React, {
    createContext,
    useCallback,
    useMemo,
    useSyncExternalStore,
} from "react";

import { Provider as ReduxProvider } from "react-redux";
import store from "../redux/store";


const EMPTY_BOOKMARKS: string[] = [];

// const getBookmarksSnapshot = (): string[] => {
//     const bookmarks = localStorage.getItem("bookmarks");

//     return bookmarks ? JSON.parse(bookmarks) : [];
// };

// type BookmarkContextType {
//     bookmarks: string[];
//     isBookmarked: (roomId: string) => boolean;
//     toggleBookmark: (roomId: string) => void;
// };

// export const BookmarkContext = createContext({
//     bookmarks: [],
//     isBookmarked: () => false,
//     toggleBookmark: () => {},
// });


const subscribeBookmarks = (callback: () => void) => {
    const handleStorage = (event: StorageEvent) => {
        if (event.key === "bookmarks") callback(); // 
    };

    window.addEventListener("storage", handleStorage);
    return () => {
        window.removeEventListener("storage", handleStorage);
    }
};

const getClientBookmarkSnapshot = (): string[] => {
    if (typeof window === "undefined") return []; // SSR safety
  const stored = window.localStorage.getItem("bookmarks");
  if (!stored) return [];

  // ...
  return JSON.parse(stored);
};

const getServerBookmarkSnapshot = (): string[] => EMPTY_BOOKMARKS;

export default function useBookmarks() {
    const bookmarks = useSyncExternalStore( // External database from react.
        subscribeBookmarks, // tells when bookmarks change
        getClientBookmarkSnapshot, // read current bookmarks
        getServerBookmarkSnapshot // if we are not in the browser yet, what should the value be (????)
    )

    const isBookmarked = (roomId: string) => {
        return bookmarks.includes(roomId);
    };

    const toggleBookmark = (roomId: string) => {
        let nextBookmarks: string[];
        if (isBookmarked(roomId)) {
            nextBookmarks = bookmarks.filter((id) => id !== roomId)
        } else {
            nextBookmarks = [...bookmarks, roomId];
        }

        window.localStorage.setItem("bookmarks", JSON.stringify(nextBookmarks));
        
        // Manually trigger event so current page refreshes immediately
        window.dispatchEvent(new StorageEvent("storage", { key: "bookmarks", newValue: JSON.stringify(nextBookmarks) }));
    };


    return {
        bookmarks,
        isBookmarked,
        toggleBookmark,
    };
}
