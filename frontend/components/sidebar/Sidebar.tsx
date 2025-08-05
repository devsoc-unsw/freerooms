import LogoClosed from "@frontend/public/assets/easterEggButton/logo-closed.svg";
import LogoOpen from "@frontend/public/assets/easterEggButton/logo-open.svg";
import {
  Box,
  CssBaseline,
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  List,
  Typography,
  useTheme,
} from "@mui/material";
import { CSSObject, styled, Theme } from "@mui/material/styles";
import {
  BookOpenIcon,
  LayoutGridIcon,
  MapIcon,
  PanelLeftIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import DarkModeToggle from "./DarkModeToggle";
import SidebarItem from "./SidebarItem";

const drawerWidth = 250;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: theme.spacing(7.5), // 60px
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ theme, open }) => ({
  width: drawerWidth,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open ? openedMixin(theme) : closedMixin(theme)),
  "& .MuiDrawer-paper": open ? openedMixin(theme) : closedMixin(theme),
  backgroundColor: theme.palette.background.default,
}));

const navItems = [
  {
    label: "Browse Buildings",
    href: "/browse",
    icon: <BookOpenIcon size={20} />,
  },
  {
    label: "View Map",
    href: "/map",
    icon: <MapIcon size={20} />,
  },
  {
    label: "All Rooms",
    href: "/allRooms",
    icon: <LayoutGridIcon size={20} />,
  },
];

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [logoHover, setLogoHover] = React.useState(false); // NEW

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer variant="permanent" open={sidebarOpen}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent={sidebarOpen ? "space-between" : "center"}
          px={theme.spacing(2)}
          py={theme.spacing(2)}
        >
          {sidebarOpen && (
            <Link href="/" passHref legacyBehavior>
              <Box
                component="a"
                display="flex"
                alignItems="center"
                gap={theme.spacing(1.5)}
                pl={theme.spacing(1.5)}
                sx={{
                  textDecoration: "none",
                  color: theme.palette.text.primary,
                  transition: "opacity 0.3s",
                  "&:hover": {
                    opacity: 0.75,
                  },
                }}
                onMouseEnter={() => setLogoHover(true)}
                onMouseLeave={() => setLogoHover(false)}
              >
                <Image
                  src={logoHover ? LogoClosed : LogoOpen}
                  alt="Logo"
                  height={32}
                />
                <Typography variant="h6" fontWeight={600} ml={2}>
                  Freerooms
                </Typography>
              </Box>
            </Link>
          )}
          <IconButton onClick={toggleSidebar}>
            <PanelLeftIcon size={20} color={theme.palette.text.primary} />
          </IconButton>
        </Box>

        <Divider sx={{ backgroundColor: theme.palette.divider }} />

        <List sx={{ px: theme.spacing(1), pt: theme.spacing(1) }}>
          {navItems.map(({ label, href, icon }) => (
            <SidebarItem
              key={href}
              icon={icon}
              label={label}
              href={href}
              sidebarOpen={sidebarOpen}
              active={pathname === href}
            />
          ))}
        </List>

        <Box flexGrow={1} />

        <Box px={theme.spacing(1)} pb={theme.spacing(2)}>
          <DarkModeToggle sidebarOpen={sidebarOpen} />
        </Box>
      </Drawer>
      {children}
    </Box>
  );
};

export default Sidebar;
