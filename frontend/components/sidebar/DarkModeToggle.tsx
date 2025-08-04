import { DarkModeContext } from "@frontend/app/clientLayout";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { MoonIcon, SunIcon } from "lucide-react";
import React from "react";

const DarkModeToggle = ({ sidebarOpen }: { sidebarOpen: boolean }) => {
  const { isDarkMode, toggleDarkMode } = React.useContext(DarkModeContext);

  return (
    <ListItem disablePadding sx={{ display: "block", marginBottom: 1 }}>
      <ListItemButton
        disableRipple
        onClick={toggleDarkMode}
        sx={[
          {
            minHeight: 48,
            px: 2.5,
            justifyContent: "center",
            borderRadius: "8px",
          },
          sidebarOpen
            ? {
                justifyContent: "initial",
              }
            : {
                justifyContent: "center",
              },
        ]}
      >
        <ListItemIcon
          sx={[
            {
              minWidth: 0,
              justifyContent: "center",
            },
            sidebarOpen
              ? {
                  mr: 3,
                }
              : {
                  mr: "auto",
                },
          ]}
        >
          {isDarkMode ? <MoonIcon /> : <SunIcon />}
        </ListItemIcon>
        <ListItemText
          primary={isDarkMode ? "Light Mode" : "Dark Mode"}
          sx={[
            sidebarOpen
              ? {
                  opacity: 1,
                }
              : {
                  opacity: 0,
                },
          ]}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default DarkModeToggle;
