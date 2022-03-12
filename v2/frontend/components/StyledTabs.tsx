import React from "react";
import Tabs, { TabsProps } from "@mui/material/Tabs";
import Tab, { TabProps } from "@mui/material/Tab";
import { styled } from "@mui/material/styles";

export const StyledTabs = styled(Tabs)<TabsProps>(({ theme }) => ({
  backgroundColor: "#eee",
  borderRadius: 10,
  minHeight: 44,
  "& .MuiTabs-flexContainer": {
    position: "relative",
    zIndex: 1,
  },
  "& .MuiTabs-scroller": {
    [theme.breakpoints.up("md")]: {
      padding: "0 1px",
    },
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
      backgroundColor: "#fff",
      boxShadow: "0 4px 12px 0 rgba(0,0,0,0.16)",
    },
  },
}));

export const StyledTab = styled((props: TabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  transition: "color 0.2s ease-in",
  textTransform: "none",
  fontSize: 15,
  "&:hover": {
    opacity: 1,
  },
  minHeight: 44,
  minWidth: 96,
  [theme.breakpoints.up("md")]: {
    minWidth: 120,
  },
  "& .MuiTab-wrapper": {
    // zIndex: 2,
    // marginTop: spacing(0.5),
    color: theme.palette.text.primary,
    textTransform: "initial",
  },
}));
