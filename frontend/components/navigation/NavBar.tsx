"use client";

import { DarkModeContext } from "@frontend/app/clientLayout";
import Branding from "@frontend/components/landing/Branding";
import {
  CalendarMonthOutlined,
  DarkModeOutlined,
  FavoriteBorderOutlined,
  GridViewOutlined,
  HomeOutlined,
  LightModeOutlined,
  Map as MapIcon,
  MoreHoriz,
  PersonOutlineOutlined,
  SvgIconComponent,
  VolunteerActivismOutlined,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuItemProps,
  Popover,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext, useState } from "react";

// There are 3 versions of the navbar component:
// desktop (>1200px), tablet (1199px - 600px) and mobile (<600px).

// -----------------------------------------------------------------------------
//  Shared navbar code
// -----------------------------------------------------------------------------

// ---------- Navbar links ----------
interface NavItem {
  label: string;
  href: string;
  icon: SvgIconComponent;
  ariaLabel: string;
}

// Bottom nav items on display
const NAV_TAB_ITEMS: NavItem[] = [
  {
    label: "Rooms",
    href: "/browse",
    icon: GridViewOutlined,
    ariaLabel: "Browse buildings and rooms",
  },
  {
    label: "Favourites",
    href: "/favourites",
    icon: FavoriteBorderOutlined,
    ariaLabel: "Go to favourites page",
  },
  {
    label: "Bookings",
    href: "/bookings",
    icon: CalendarMonthOutlined,
    ariaLabel: "Go to bookings page",
  },
  { label: "Map", href: "/map", icon: MapIcon, ariaLabel: "Go to map" },
];

// Pages inside the mobile "more" menu (less important)
const NAV_MORE_ITEMS: NavItem[] = [
  {
    label: "Sponsors",
    href: "/sponsors",
    icon: VolunteerActivismOutlined,
    ariaLabel: "Go to sponsors page",
  },
];

// Home tab is separated since tablet / desktop uses the icon as home button
const HOME_ITEM: NavItem = {
  label: "Home",
  href: "/",
  icon: HomeOutlined,
  ariaLabel: "Go to home page",
};

// ---------- Dark mode ----------
const useDarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);

  return {
    isDarkMode,
    toggle: toggleDarkMode,
    Icon: isDarkMode ? LightModeOutlined : DarkModeOutlined,
    actionLabel: isDarkMode ? "Use light mode" : "Use dark mode",
    menuLabel: isDarkMode ? "Light mode" : "Dark mode",
  };
};

// ---------- Popover code ----------
// Open bottom nav popup upwards
const OPEN_UPWARDS = {
  anchorOrigin: { vertical: "top", horizontal: "right" },
  transformOrigin: { vertical: "bottom", horizontal: "right" },
} as const;

// Open top nav popups downwards
const OPEN_DOWNWARDS = {
  anchorOrigin: { vertical: "bottom", horizontal: "right" },
  transformOrigin: { vertical: "top", horizontal: "right" },
} as const;

// Open/close state for anchored components (menu, popover)
const useAnchor = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return {
    anchorEl,
    isOpen: Boolean(anchorEl),
    open: (event: React.MouseEvent<HTMLElement>) =>
      setAnchorEl(event.currentTarget),
    close: () => setAnchorEl(null),
  };
};

// ---------- Components  ----------
interface NavMenuItemProps extends MenuItemProps {
  item: NavItem;
}

const NavMenuItem = ({ item, ...props }: NavMenuItemProps) => {
  const path = usePathname();
  const { label, href, icon: Icon, ariaLabel } = item;

  return (
    <MenuItem
      component={Link}
      href={href}
      selected={path === href}
      aria-label={ariaLabel}
      {...props}
    >
      <ListItemIcon>
        <Icon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{label}</ListItemText>
    </MenuItem>
  );
};

// -----------------------------------------------------------------------------
//  Mobile navbar code
// -----------------------------------------------------------------------------

// ---------- Constants ----------
// Navbar links
const MOBILE_TAB_ITEMS = NAV_TAB_ITEMS;
const MOBILE_MORE_ITEMS: NavItem[] = [HOME_ITEM, ...NAV_MORE_ITEMS];

// Determine which tab to highlight
const MOBILE_TAB_HREFS = MOBILE_TAB_ITEMS.map((item) => item.href);
const MOBILE_MORE_HREFS = MOBILE_MORE_ITEMS.map((item) => item.href);
const getMobileNavValue = (
  path: string,
  isMoreOpen: boolean
): string | false => {
  if (isMoreOpen || MOBILE_MORE_HREFS.includes(path)) return "more";
  if (MOBILE_TAB_HREFS.includes(path)) return path;
  return false;
};

// ---------- Styled components ----------
const MobileNavContainer = styled(BottomNavigation)(({ theme }) => ({
  position: "fixed",
  bottom: theme.space.none,
  left: theme.space.none,
  right: theme.space.none,
  zIndex: theme.zIndex.appBar,
  background: theme.colours.surface.appBar,
  height: "auto",
  paddingBottom: "env(safe-area-inset-bottom)", // iPhone home indicator
  [theme.breakpoints.up("sm")]: { display: "none" },
  "& .MuiBottomNavigationAction-root": {
    color: theme.colours.text.primary,
    paddingTop: theme.space.sm,
    paddingBottom: theme.space.sm,
  },
  "& .MuiBottomNavigationAction-root.Mui-selected": {
    color: theme.colours.accent.primary,
  },
}));

const MobileMoreMenuContainer = styled(Menu)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { display: "none" },
}));

// ---------- React components ----------
// Bottom nav more popup
interface MobileMoreMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

const MobileMoreMenu = ({ anchorEl, onClose }: MobileMoreMenuProps) => {
  const { toggle, Icon, actionLabel, menuLabel } = useDarkModeToggle();

  const handleDarkModeClick = () => {
    toggle();
    onClose();
  };

  return (
    <MobileMoreMenuContainer
      disableScrollLock
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      {...OPEN_UPWARDS}
    >
      {MOBILE_MORE_ITEMS.map((item) => (
        <NavMenuItem key={item.href} item={item} onClick={onClose} />
      ))}

      <MenuItem aria-label={actionLabel} onClick={handleDarkModeClick}>
        <ListItemIcon>
          <Icon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{menuLabel}</ListItemText>
      </MenuItem>

      {/* Todo: replace when profiles implemented. not currently clickable */}
      <MenuItem disabled aria-label="Profile (coming soon)">
        <ListItemIcon>
          <PersonOutlineOutlined fontSize="small" />
        </ListItemIcon>
        <ListItemText>Profile</ListItemText>
        <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
          Coming soon!
        </Typography>
      </MenuItem>
    </MobileMoreMenuContainer>
  );
};

// Full mobile (bottom) nav component
const MobileNav = () => {
  const path = usePathname();
  const more = useAnchor();

  return (
    <>
      <MobileNavContainer
        showLabels
        aria-label="Main navigation"
        value={getMobileNavValue(path, more.isOpen)}
      >
        {MOBILE_TAB_ITEMS.map(({ label, href, icon: Icon, ariaLabel }) => (
          <BottomNavigationAction
            key={href}
            label={label}
            value={href}
            aria-label={ariaLabel}
            icon={<Icon />}
            component={Link}
            href={href}
          />
        ))}
        <BottomNavigationAction
          label="More"
          value={MOBILE_MORE_ITEMS}
          aria-label="Open more options"
          aria-haspopup="true"
          aria-expanded={more.isOpen}
          icon={<MoreHoriz />}
          onClick={more.open}
        />
      </MobileNavContainer>
      <MobileMoreMenu anchorEl={more.anchorEl} onClose={more.close} />
    </>
  );
};

// -----------------------------------------------------------------------------
//  Tablet navbar code
// -----------------------------------------------------------------------------

// ---------- Constants ----------
// Tablet dropdown menu navigation = mobile tab + mobile more tabs
const TABLET_DESKTOP_ITEMS: NavItem[] = [...NAV_TAB_ITEMS, ...NAV_MORE_ITEMS];

// Hide hamburger menu >1200px width
const TabletHamburgerButton = styled(IconButton)(({ theme }) => ({
  [theme.breakpoints.up("lg")]: { display: "none" },
}));

// Hide popovers if resized out of tablet range
const TabletHamburgerDropdown = styled(Menu)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: { display: "none" },
  [theme.breakpoints.up("lg")]: { display: "none" },
}));

// ---------- React components ----------
// Tablet hamburger = button + dropdown (rendered inside the desktop nav bar)
const TabletHamburgerMenu = () => {
  const { anchorEl, isOpen, open, close } = useAnchor();

  return (
    <>
      <TabletHamburgerButton
        aria-label="Open navigation menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={open}
      >
        <MenuIcon />
      </TabletHamburgerButton>
      <TabletHamburgerDropdown
        disableScrollLock
        anchorEl={anchorEl}
        open={isOpen}
        onClose={close}
        {...OPEN_DOWNWARDS}
      >
        {TABLET_DESKTOP_ITEMS.map((item) => (
          <NavMenuItem key={item.href} item={item} onClick={close} />
        ))}
      </TabletHamburgerDropdown>
    </>
  );
};

// -----------------------------------------------------------------------------
//  Desktop & tablet navbar code (shared top navbar)
// -----------------------------------------------------------------------------

// ---------- Styled components ----------
// Desktop & tablet top navbar: >600px
const DesktopTabletNavContainer = styled(AppBar)(({ theme }) => ({
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
  [theme.breakpoints.down("sm")]: { display: "none" },
}));

// Desktop: >=1200px
const DesktopNavLinks = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  gap: theme.space.xxl,
  alignItems: "center",
  height: "stretch",
  [theme.breakpoints.down("lg")]: { display: "none" },
}));

const DesktopNavActions = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  gap: theme.space.lg,
  alignItems: "center",
}));

const StyledTopNavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>(({ theme, active }) => ({
  padding: theme.space.none,
  color: active ? theme.colours.accent.primary : theme.colours.text.primary,
  textTransform: "none",
  gap: theme.space.md,
  transition: theme.transitions.create(["color"], {
    duration: theme.transitions.duration.short,
  }),
  "&:hover": {
    backgroundColor: "transparent",
    color: active ? theme.colours.text.primary : theme.colours.accent.primary,
  },
}));

// ---------- React components ----------
const TopNavButton = ({ item }: { item: NavItem }) => {
  const path = usePathname();
  const isActive = path === item.href;
  const { label, href, icon: Icon, ariaLabel } = item;

  return (
    <StyledTopNavButton
      disableRipple
      href={href}
      variant="text"
      active={isActive}
      aria-label={ariaLabel}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon />
      {label}
    </StyledTopNavButton>
  );
};

const DarkModeButton = () => {
  const { isDarkMode, toggle, Icon, actionLabel } = useDarkModeToggle();

  return (
    <StyledTopNavButton
      disableRipple
      aria-label={actionLabel}
      aria-pressed={isDarkMode}
      onClick={toggle}
    >
      <Icon />
    </StyledTopNavButton>
  );
};

// Temporary login popover. Todo: replace with proper logins once implemented
const LoginButton = () => {
  const { anchorEl, isOpen, open, close } = useAnchor();
  const popoverId = isOpen ? "login-popover" : undefined;

  return (
    <>
      <Button
        disableRipple
        variant="contained"
        aria-describedby={popoverId}
        onClick={open}
      >
        Login
      </Button>
      <Popover
        disableScrollLock
        id={popoverId}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={close}
        {...OPEN_DOWNWARDS}
      >
        <Stack
          sx={{
            p: (theme) => theme.space.sm,
            gap: (theme) => theme.space.xs,
            width: (theme) => theme.sizes.loginPopover.width,
          }}
        >
          <Typography variant="subtitle1" component="h2">
            Login
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Coming soon!
          </Typography>
        </Stack>
      </Popover>
    </>
  );
};

// Full desktop nav component
const DesktopNav = () => (
  <DesktopTabletNavContainer>
    <Branding />
    <DesktopNavLinks>
      {TABLET_DESKTOP_ITEMS.map((item) => (
        <TopNavButton key={item.href} item={item} />
      ))}
    </DesktopNavLinks>
    <DesktopNavActions>
      <DarkModeButton />
      <LoginButton />
      <TabletHamburgerMenu />
    </DesktopNavActions>
  </DesktopTabletNavContainer>
);

// -----------------------------------------------------------------------------
//  Navbar component
// -----------------------------------------------------------------------------

const NavBar: React.FC = () => (
  <>
    <DesktopNav />
    <MobileNav />
  </>
);

export default NavBar;
