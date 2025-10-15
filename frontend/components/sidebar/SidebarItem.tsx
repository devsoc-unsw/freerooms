import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import React from "react";

interface SidebarItemProps {
  icon: React.ReactElement;
  label: string;
  href?: string;
  sidebarOpen: boolean;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  href,
  sidebarOpen,
  active,
  onClick,
}) => {
  const theme = useTheme();

  const buttonStyles = {
    minHeight: 48,
    px: theme.spacing(2.5),
    borderRadius: theme.shape.borderRadius,
    justifyContent: sidebarOpen ? "initial" : "center",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  };

  const iconStyles = {
    minWidth: 0,
    justifyContent: "center",
    mr: sidebarOpen ? theme.spacing(2) : "auto",
    color: theme.palette.text.primary,
  };

  const content = (
    <ListItemButton
      disableRipple
      selected={active}
      onClick={onClick}
      {...(href && { LinkComponent: Link, href })}
      sx={buttonStyles}
    >
      <ListItemIcon sx={iconStyles}>{icon}</ListItemIcon>
      {sidebarOpen && <ListItemText primary={label} />}
    </ListItemButton>
  );

  return (
    <Tooltip title={!sidebarOpen ? label : ""} placement="right">
      <ListItem disablePadding sx={{ display: "block", mb: theme.spacing(1) }}>
        {content}
      </ListItem>
    </Tooltip>
  );
};

export default SidebarItem;
