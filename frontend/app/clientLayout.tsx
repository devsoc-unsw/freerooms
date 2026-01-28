"use client";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import NavBar from "@frontend/components/NavBar";
import { grey, orange } from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, styled } from "@mui/material/styles";
import ThemeProvider from "@mui/system/ThemeProvider";
import Sidebar from "components/sidebar/Sidebar";
import React, { createContext, useEffect, useMemo, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";

import SearchModal from "../components/SearchModal";
import store from "../redux/store";

export const DarkModeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

/**
 * Any global components like providers or configs should go here
 */
const ClientLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMode((localStorage.getItem("darkMode") as any) || "light");
  }, []);

  const toggle = useMemo(
    () => ({
      isDarkMode: mode === "dark",
      toggleDarkMode: () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
        localStorage.setItem("darkMode", mode === "light" ? "dark" : "light");
      },
    }),
    [mode]
  );

  const theme = createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: {
              main: "#EF6C02",
              light: "#F3D0C5",
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
              main: "#EF6C02",
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
  });

  return (
    <DarkModeContext.Provider value={toggle}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ReduxProvider store={store}>
          <App>{children}</App>
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
      <Sidebar>
        <SearchModal />
        <Main>{children}</Main>
      </Sidebar>
    </>
  );
};

const Main = styled("main")(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: "100%",
  marginRight: 0,
  height: "100%",
}));

export default ClientLayout;
