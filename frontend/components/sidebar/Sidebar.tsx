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
  boxSizing: "border-box",
  zIndex: theme.zIndex.drawer,
  ...(open ? openedMixin(theme) : closedMixin(theme)),
  "& .MuiDrawer-paper": open ? openedMixin(theme) : closedMixin(theme),
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
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={theme.spacing(2)}
        py={theme.spacing(2)}
      >
        {sidebarOpen ? (
          <Link href="/" passHref legacyBehavior>
            <Box
              component="a"
              display="flex"
              alignItems="center"
              gap={theme.spacing(1.5)}
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
                  fontWeight={600}
                  sx={{ color: theme.palette.primary.main }}
                >
                  Freerooms
                </Typography>
              </div>
            </Box>
          </Link>
        ) : (
          <Image
            src={logoHover ? LogoClosed : LogoOpen}
            alt="Logo"
            height={32}
          />
        )}
      </Box>

      <Divider
        sx={{ backgroundColor: theme.palette.divider, mx: theme.spacing(2) }}
      />

      <List sx={{ px: theme.spacing(1), pt: theme.spacing(1) }}>
        {/* TODO turn this into a custom component */}
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

      <Box flexGrow={1} />
      <Box px={theme.spacing(1)} pb={theme.spacing(2)}>
        <DarkModeToggle sidebarOpen={sidebarOpen} />
      </Box>
    </>
  );
};

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const toggleMobileSidebar = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Mobile Top Bar */}
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
            fontWeight={600}
            sx={{ color: theme.palette.primary.main }}
          >
            Freerooms
          </Typography>
        </Box>
      )}

      {/* Desktop Drawer */}
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Drawer variant="permanent" open={sidebarOpen}>
          <SidebarContent
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </Drawer>
      </Box>

      {/* Mobile Drawer */}
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

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          pt: isMobile ? theme.spacing(7) : 0, // pushes content below topbar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Sidebar;
