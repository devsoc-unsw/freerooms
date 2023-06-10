"use client"

import { orange } from "@mui/material/colors";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import { createTheme } from "@mui/material/styles";
import ThemeProvider from "@mui/system/ThemeProvider";
import React from "react";
import { Provider as ReduxProvider } from 'react-redux'

import NavBar from "../components/NavBar";
import SearchModal from "../components/SearchModal";
import { selectCurrentBuilding, setCurrentBuilding } from "../redux/currentBuildingSlice";
import { useDispatch, useSelector } from "../redux/hooks";
import store from '../redux/store'
import BuildingInfo from "../views/BuildingInfo";

const theme = createTheme({
  palette: {
    primary: {
      main: orange[800],
    },
  },
});

const drawerWidth = 400;

const ClientLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
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
  const dispatch = useDispatch();
  const currentBuilding = useSelector(selectCurrentBuilding);
  const drawerOpen = !!currentBuilding;

  return (
    <>
      <NavBar setSearchOpen={setSearchOpen}/>
      <SearchModal open={searchOpen} setOpen={setSearchOpen}/>
      {children}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="right"
        open={drawerOpen}
      >
        <Divider />
        <BuildingInfo
          building={currentBuilding}
          onClose={() => dispatch(setCurrentBuilding(null))}
          datetime={new Date()}
          setDatetime={() => {}}
          roomStatusData={undefined}
        />
      </Drawer>
    </>
  )
}

export default ClientLayout;
