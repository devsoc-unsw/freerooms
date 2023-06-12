"use client"

import { orange } from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, styled } from "@mui/material/styles";
import ThemeProvider from "@mui/system/ThemeProvider";
import React from "react";
import { Provider as ReduxProvider } from 'react-redux'

import NavBar, { navHeight } from "../components/NavBar";
import SearchModal from "../components/SearchModal";
import { selectCurrentBuilding } from "../redux/currentBuildingSlice";
import { useSelector } from "../redux/hooks";
import store from '../redux/store'
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
        <App>
          {children}
        </App>
      </ReduxProvider>
    </ThemeProvider>
  )
}

/**
 * App is a separate component so we can make use of the providers in ClientLayout
 */
const App: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const currentBuilding = useSelector(selectCurrentBuilding);
  const drawerOpen = !!currentBuilding;

  return (
    <>
      <NavBar setSearchOpen={setSearchOpen}/>
      <SearchModal open={searchOpen} setOpen={setSearchOpen}/>
      <Main drawerOpen={drawerOpen}>
        {children}
      </Main>
      <BuildingDrawer/>
    </>
  )
}

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "drawerOpen"
})<{ drawerOpen: boolean; }>(({ theme, drawerOpen }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginTop: navHeight,
  width: '100%',
  marginRight: 0,
  maxHeight: "100vh",
  ...(drawerOpen && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

export default ClientLayout;
