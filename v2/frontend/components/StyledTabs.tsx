import { styled } from "@mui/material/styles";
import Tab, { TabProps } from "@mui/material/Tab";
import Tabs, { TabsProps } from "@mui/material/Tabs";
import React from "react";

export const StyledTabs = styled(Tabs)<TabsProps>(({ theme }) => ({
  backgroundColor: "#eee",
  borderRadius: 10,
  minHeight: 44,
  transition: "color 0.1s ease-in-out",
  "& .MuiButtonBase-root.Mui-selected": {
    color: "#fff",
  },
  "& .MuiTabs-flexContainer": {
    position: "relative",
    zIndex: 1,
  },
  "& .MuiTabs-indicator": {
    top: 3,
    bottom: 3,
    right: 3,
    height: "auto",
    background: "none",
    "&:after": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      left: 4,
      right: 4,
      bottom: 0,
      borderRadius: 8,
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

export const StyledTab = styled((props: TabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  color: "#333",
  textTransform: "none",
  "&:hover": {
    color: theme.palette.primary.main,
  },
  transition: "color 0.25s ease-in-out",
}));
