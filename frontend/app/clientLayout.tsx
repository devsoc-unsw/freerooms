"use client";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { orange } from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, styled } from "@mui/material/styles";
import ThemeProvider from "@mui/system/ThemeProvider";
import { usePathname } from "next/navigation";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";

import NavBar, { navHeight } from "../components/NavBar";
import SearchModal from "../components/SearchModal";
import { selectCurrentBuilding } from "../redux/currentBuildingSlice";
import { useSelector } from "../redux/hooks";
import store from "../redux/store";
import BuildingDrawer, { drawerWidth } from "../views/BuildingDrawer";

const theme = createTheme({
  palette: {
    primary: {
      main: orange[800],
    },
  },
});

/**
 * Any global components like providers or configs should go here
 */
const ClientLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ReduxProvider store={store}>
        <App>{children}</App>
      </ReduxProvider>
    </ThemeProvider>
  );
};

/**
 * App is a separate component so we can make use of the providers in ClientLayout
 */
const App: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const currentBuilding = useSelector(selectCurrentBuilding);
  const path = usePathname();
  const drawerOpen = !!currentBuilding && (path == "/browse" || path == "/map");

  return (
    <>
      <NavBar drawerOpen={drawerOpen} />
      <SearchModal />
      <Main drawerOpen={drawerOpen}>{children}</Main>
      <BuildingDrawer open={drawerOpen} />
    </>
  );
};

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "drawerOpen",
})<{ drawerOpen: boolean }>(({ theme, drawerOpen }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  paddingTop: navHeight,
  width: "100%",
  marginRight: 0,
  height: "100%",
  ...(drawerOpen && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default ClientLayout;
