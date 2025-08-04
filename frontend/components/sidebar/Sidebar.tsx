import LogoOpen from "@frontend/public/assets/logo-open.svg";
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import { CSSObject, styled, Theme, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {
  BookOpenIcon,
  DoorOpenIcon,
  MapIcon,
  PanelLeftIcon,
  SunMoonIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import DarkModeToggle from "./DarkModeToggle";
import SidebarItem from "./SidebarIconButton";

const drawerWidth = 250;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: "8px 16px",
}));

const SidebarFooter = styled("div")`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-end;
  padding: 10px 16px;
  gap: 8px;
`;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

const mainMenuItems: Array<{
  title: string;
  link: string;
  icon: React.ReactElement;
}> = [
  { title: "Browse Buildings", link: "/browse", icon: <BookOpenIcon /> },
  { title: "View Map", link: "/map", icon: <MapIcon /> },
  { title: "All Free Rooms", link: "/allRooms", icon: <DoorOpenIcon /> },
];

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const path = usePathname();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="initial"
            width={"100%"}
          >
            <IconButton
              disableRipple
              href="/"
              LinkComponent={Link}
              sx={[
                {
                  minWidth: 0,
                  justifyContent: "center",
                  borderRadius: "0px",
                  ml: -0.5,
                },
                open ? { mr: 5 } : { mr: "auto" },
              ]}
            >
              <Image height={40} src={LogoOpen} alt="Freerooms Logo" priority />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              fontWeight={700}
              marginLeft={-1.5}
              sx={[open ? { opacity: 1 } : { opacity: 0 }]}
            >
              Freerooms
            </Typography>
          </Box>
        </DrawerHeader>
        <Divider />
        <List sx={{ padding: "10px 16px" }}>
          {mainMenuItems.map(({ title, link, icon }) => (
            <SidebarItem
              key={title}
              icon={icon}
              label={title}
              href={link}
              sidebarOpen={open}
              active={path === link}
            />
          ))}
        </List>
        <SidebarFooter>
          <DarkModeToggle sidebarOpen={open} />
          <Divider />
          <Box
            display="flex"
            justifyContent={open ? "space-between" : "center"}
            alignItems="center"
            width="100%"
          >
            {open && (
              <Typography
                variant="caption"
                display="block"
                sx={{ color: theme.palette.text.secondary }}
              >
                © DevSoc {new Date().getFullYear()}, v1.0.0
              </Typography>
            )}
            <IconButton
              onClick={open ? handleDrawerClose : handleDrawerOpen}
              sx={{ borderRadius: "8px" }}
            >
              <PanelLeftIcon />
            </IconButton>
          </Box>
        </SidebarFooter>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
}
