import LogoClosed from "@frontend/public/assets/easterEggButton/logo-closed.svg";
import LogoOpen from "@frontend/public/assets/easterEggButton/logo-open.svg";
import { useDispatch } from "@frontend/redux/hooks";
import { openSearch } from "@frontend/redux/searchOpenSlice";
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
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  DoorOpenIcon,
  LayoutGridIcon,
  MapIcon,
  MenuIcon,
  PanelLeftIcon,
  SearchIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import DarkModeToggle from "./DarkModeToggle";
import SidebarItem from "./SidebarItem";

const drawerWidth = 230;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  width: theme.spacing(7.5),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  zIndex: theme.zIndex.drawer,
  border: "none",
  ...(open ? openedMixin(theme) : closedMixin(theme)),
  "& .MuiDrawer-paper": {
    ...(open ? openedMixin(theme) : closedMixin(theme)),
    border: "none",
  },
}));

const navItems = [
  {
    label: "Search",
    icon: <SearchIcon size={20} />,
  },
  {
    label: "Browse Buildings",
    href: "/browse",
    icon: <LayoutGridIcon size={20} />,
  },
  {
    label: "View Map",
    href: "/map",
    icon: <MapIcon size={20} />,
  },
  {
    label: "All Rooms",
    href: "/allRooms",
    icon: <DoorOpenIcon size={20} />,
  },
];

const SidebarContent = ({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) => {
  const theme = useTheme();
  const pathname = usePathname();
  const [logoHover, setLogoHover] = React.useState(false);
  const dispatch = useDispatch();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2),
          paddingTop: theme.spacing(2),
          paddingBottom: theme.spacing(2),
        }}
      >
        {sidebarOpen ? (
          <Link href="/" passHref legacyBehavior>
            <Box
              component="a"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(1.5),
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
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: theme.spacing(1),
                }}
              >
                <Image
                  src={logoHover ? LogoClosed : LogoOpen}
                  alt="Logo"
                  height={30}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                  }}
                >
                  Freerooms
                </Typography>
              </div>
            </Box>
          </Link>
        ) : (
          <Link href="/" passHref legacyBehavior>
            <Image
              style={{ cursor: "pointer" }}
              src={logoHover ? LogoClosed : LogoOpen}
              alt="Logo"
              height={32}
            />
          </Link>
        )}
      </Box>

      <Divider
        sx={{ backgroundColor: theme.palette.divider, mx: theme.spacing(2) }}
      />

      <List sx={{ px: theme.spacing(1), pt: theme.spacing(1) }}>
        <SidebarItem
          icon={<PanelLeftIcon size={20} />}
          label={"Close sidebar"}
          sidebarOpen={sidebarOpen}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />

        {navItems.map(({ label, href, icon }) => (
          <SidebarItem
            key={label}
            icon={icon}
            label={label}
            href={href}
            onClick={
              label === "Search" ? () => dispatch(openSearch()) : undefined
            }
            sidebarOpen={sidebarOpen}
            active={pathname === href}
          />
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Box
        sx={{
          paddingLeft: theme.spacing(1),
          paddingRight: theme.spacing(1),
          paddingBottom: theme.spacing(2),
        }}
      >
        <DarkModeToggle sidebarOpen={sidebarOpen} />
      </Box>
    </>
  );
};

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const toggleMobileSidebar = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", border: "none" }}>
      <CssBaseline />

      {isMobile && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: theme.spacing(2),
            py: theme.spacing(1),
            backgroundColor: theme.palette.background.default,
            borderBottom: `1px solid ${theme.palette.divider}`,
            width: "100%",
            position: "fixed",
            zIndex: theme.zIndex.appBar + 1,
          }}
        >
          <IconButton onClick={toggleMobileSidebar} color="inherit">
            <MenuIcon />
          </IconButton>
          <IconButton LinkComponent={Link} href="/">
            <Image src={LogoOpen} alt="Logo" height={32} width={32} />
          </IconButton>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: theme.palette.primary.main }}
          >
            Freerooms
          </Typography>
        </Box>
      )}

      <Box sx={{ display: { xs: "none", md: "block", border: "none" } }}>
        <Drawer variant="permanent" open={sidebarOpen}>
          <SidebarContent
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </Drawer>
      </Box>

      <MuiDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={toggleMobileSidebar}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            border: "none",
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        <SidebarContent
          sidebarOpen={true}
          setSidebarOpen={toggleMobileSidebar}
        />
      </MuiDrawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          paddingTop: isMobile ? theme.spacing(7) : 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Sidebar;