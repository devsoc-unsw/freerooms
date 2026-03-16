import { DarkModeContext } from "@frontend/app/clientLayout";
import { useTheme } from "@mui/material";
import { MoonIcon, SunIcon } from "lucide-react";
import React from "react";

import SidebarItem from "./SidebarItem";

const DarkModeToggle = ({ sidebarOpen }: { sidebarOpen: boolean }) => {
  const { isDarkMode, toggleDarkMode } = React.useContext(DarkModeContext);
  const theme = useTheme();

  return (
    <SidebarItem
      icon={
        isDarkMode ? (
          <SunIcon size={20} color={theme.palette.text.primary} />
        ) : (
          <MoonIcon size={20} color={theme.palette.text.primary} />
        )
      }
      label={isDarkMode ? "Light Mode" : "Dark Mode"}
      onClick={toggleDarkMode}
      sidebarOpen={sidebarOpen}
    />
  );
};

export default DarkModeToggle;
