"use client";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import NavBar, { navHeight } from "@frontend/components/NavBar";
import { grey } from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, styled } from "@mui/material/styles";
import ThemeProvider from "@mui/system/ThemeProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import React, {
  createContext,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from "react";
import { Provider as ReduxProvider } from "react-redux";

import SearchModal from "../components/SearchModal";
import store from "../redux/store";

type ThemeMode = "light" | "dark";

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
}> = ({ children }) => {
  const mode = useSyncExternalStore(
    subscribeToDarkMode,
    getClientModeSnapshot,
    getServerModeSnapshot
  );

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

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: {
                  main: "#EF6C02",
                  light: "#F3D0C5",
                },
                success: {
                  main: "#3bdd03",
                },
                warning: {
                  main: "#FF0000",
                },
                secondary: {
                  main: "rgba(0, 0, 0, 0.12)",
                },
                background: {
                  default: "#FFFBF9",
                  paper: grey[200],
                },
                text: {
                  primary: "#000000",
                  secondary: grey[600],
                },
              }
            : {
                primary: {
                  main: "#D4613C",
                  dark: "#EF6C00",
                },
                secondary: {
                  main: grey[800],
                },
                background: {
                  default: "#101214",
                  paper: grey[800],
                },
                text: {
                  primary: "#ffffff",
                  secondary: grey[400],
                },
              }),
        },
      }),
    [mode]
  );

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
