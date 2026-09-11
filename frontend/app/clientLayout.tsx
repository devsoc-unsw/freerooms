"use client";

import NavBar, { navHeight } from "@frontend/components/NavBar";
import { createAppTheme, type ThemeMode } from "@frontend/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { styled, ThemeProvider } from "@mui/material/styles";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { Provider as ReduxProvider } from "react-redux";

import SearchModal from "../components/SearchModal";
import store from "../redux/store";

export const DarkModeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

const subscribeToDarkMode = (callback: () => void) => {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === "darkMode") {
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener("storage", handleStorage);
  };
};

const getClientModeSnapshot = (): ThemeMode => {
  const storedMode = window.localStorage.getItem("darkMode");
  return storedMode === "dark" ? "dark" : "light";
};

const getServerModeSnapshot = (): ThemeMode => "light";

/**
 * Any global components like providers or configs should go here
 */
const ClientLayout: React.FC<{
  children: React.ReactNode;
  initialTheme: ThemeMode;
}> = ({ children, initialTheme }) => {
  const getServerModeSnapshot = useCallback(
    (): ThemeMode => initialTheme,
    [initialTheme]
  );

  const mode = useSyncExternalStore(
    subscribeToDarkMode,
    getClientModeSnapshot,
    getServerModeSnapshot
  );

  useEffect(() => {
    const isValidMode = mode === "light" || mode === "dark";
    if (isValidMode) {
      document.cookie = `darkMode=${mode};path=/;max-age=315360000;samesite=lax`;
    } else {
      console.warn("Invalid theme mode provided.");
    }
  }, [mode]);

  const toggleDarkMode = useCallback(() => {
    const nextMode = mode === "light" ? "dark" : "light";
    window.localStorage.setItem("darkMode", nextMode);
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "darkMode",
        newValue: nextMode,
      })
    );
  }, [mode]);

  const darkModeContextValue = useMemo(
    () => ({
      isDarkMode: mode === "dark",
      toggleDarkMode,
    }),
    [mode, toggleDarkMode]
  );

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <DarkModeContext.Provider value={darkModeContextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ReduxProvider store={store}>
          <NuqsAdapter>
            <App>{children}</App>
          </NuqsAdapter>
        </ReduxProvider>
      </ThemeProvider>
    </DarkModeContext.Provider>
  );
};

/**
 * App is a separate component so we can make use of the providers in ClientLayout
 */
const App: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <>
      <NavBar />
      <SearchModal />
      <Main>{children}</Main>
    </>
  );
};

const Main = styled("main")(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  paddingTop: navHeight,
  width: "100%",
  marginRight: 0,
  height: "100%",
}));

export default ClientLayout;
