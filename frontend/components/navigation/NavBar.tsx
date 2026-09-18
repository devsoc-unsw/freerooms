"use client";

import { DarkModeContext } from "@frontend/app/clientLayout";
import Branding from "@frontend/components/landing/Branding";
import IconButton from "@frontend/components/ui/IconButton";
import { useDispatch } from "@frontend/redux/hooks";
import { CalendarMonthOutlined, DarkMode, FavoriteBorderOutlined, GridViewOutlined, Map, SvgIconComponent, VolunteerActivismOutlined } from "@mui/icons-material";
import MuiAppBar from "@mui/material/AppBar";
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import React, { useContext } from "react";
import { Box } from "@mui/system";
import { Button, ButtonProps } from "@mui/material";
import Link from "next/link";


const NavBar: React.FC = () => {
  const dispatch = useDispatch();
  const path = usePathname();
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  return (
    <NavBarContainer>
      
      <Branding />
      <Stack 
        direction="row" 
        sx={{ gap: (theme) => theme.space.xxl }}
      >
        <NavButtonLink
          aria-label="Browse buildings and rooms"
          path={path}
          aria-current={path === "/browse" ? "page" : undefined}
          icon={GridViewOutlined}
          label="Rooms"
          href="/browse"
        />
        <NavButtonLink
          aria-label="Go to favourites page"
          path={path}
          aria-current={path === "/favourites" ? "page" : undefined}
          icon={FavoriteBorderOutlined}
          label="Favourites"
          href="/favourites"
        />
        <NavButtonLink
          aria-label="Go to bookings page"
          path={path}
          aria-current={path === "/bookings" ? "page" : undefined}
          icon={CalendarMonthOutlined}
          label="Bookings"
          href="/bookings"
        />
        <NavButtonLink
          aria-label="Go to map"
          path={path}
          aria-current={path === "/map" ? "page" : undefined}
          icon={Map}
          label="Map"
          href="/map"
        />
        <NavButtonLink
          aria-label="Go to sponsors page"
          path={path}
          aria-current={path === "/sponsors" ? "page" : undefined}
          icon={VolunteerActivismOutlined}
          label="Sponsors"
          href="/sponsors"
        />
      </Stack>

      <Stack 
        direction="row" 
        sx={{ gap: (theme) => theme.space.xxl }}
      >
        <IconButton
          aria-label={isDarkMode ? "Use light mode" : "Use dark mode"}
          aria-pressed={isDarkMode}
          active={isDarkMode}
          onClick={toggleDarkMode}
        >
          <Box/>
          <DarkMode />
        </IconButton>
      </Stack>
    </NavBarContainer>
  );
};

const NavBarContainer = styled(MuiAppBar)<MuiAppBarProps>(({ theme }) => ({
  position: "fixed",
  background: theme.colours.surface.appBar,
  color: theme.colours.text.primary,
  boxShadow: "none",
  display: "flex",
  flexDirection: "row",
  alignItems: "start",
  justifyContent: "space-between",
  paddingTop: theme.space.md,
  paddingBottom: theme.space.md,
  paddingLeft: theme.space.xl,
  paddingRight: theme.space.xl,
  maxHeight: theme.sizes.navBar.height, // enforce max navbar height
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const StyledNavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active: boolean }>(({ theme, active }) => ({
  color: active ? theme.colours.accent.primary : theme.colours.text.primary,
  textTransform: "none",
  gap: theme.space.md,
  transition: theme.transitions.create(["color"], {
    duration: theme.transitions.duration.short,
  }),
  "&:hover": {
    backgroundColor: "transparent",
    color: active ? theme.colours.text.primary : theme.colours.accent.primary
  },
}));

interface NavButtonLinkProps extends ButtonProps {
  icon: SvgIconComponent;
  label: string;
  href: string;
  path: string;
}

const NavButtonLink = ({ icon: Icon, label, href, path, ...props }: NavButtonLinkProps) => (
  <StyledNavButton component={Link} href={href} variant="text" active={path === href} {...props}>
    <Icon />
    {label}
  </StyledNavButton>
);

export default NavBar