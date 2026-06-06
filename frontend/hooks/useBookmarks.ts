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
const BOOKMARKS_EVENT = "bookmarks_change";
let cacheRaw: string | null = null;
let cacheParsed: string[] = [];


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
    // const handleStorage = (event: StorageEvent) => {
    //     if (event.key === "bookmarks") callback(); // 
    // };

    window.addEventListener(BOOKMARKS_EVENT, callback);
    return () => {
        window.removeEventListener(BOOKMARKS_EVENT, callback);
    }
};

const getClientBookmarkSnapshot = (): string[] => {
    if (typeof window === "undefined") return EMPTY_BOOKMARKS; // SSR safety
  const stored = window.localStorage.getItem("bookmarks");
  if (stored === cacheRaw) return cacheParsed;
  cacheRaw = stored;
  cacheParsed = stored ? JSON.parse(stored) : [];

  return cacheParsed;
};

const getServerBookmarkSnapshot = (): string[] => EMPTY_BOOKMARKS;

export default function useBookmarks() {
    const bookmarks = useSyncExternalStore(
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
        window.dispatchEvent(new Event(BOOKMARKS_EVENT));
    };


    return {
        bookmarks,
        isBookmarked,
        toggleBookmark,
    };
}
