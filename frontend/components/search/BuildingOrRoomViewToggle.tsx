import type { BrowseView } from "@frontend/types";
import type { SvgIconComponent } from "@mui/icons-material";
import DomainOutlinedIcon from "@mui/icons-material/DomainOutlined";
import WindowOutlinedIcon from "@mui/icons-material/WindowOutlined";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const OPTIONS: { value: BrowseView; label: string; icon: SvgIconComponent }[] =
  [
    { value: "buildings", label: "Building View", icon: DomainOutlinedIcon },
    { value: "rooms", label: "Room View", icon: WindowOutlinedIcon },
  ];

const Track = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexShrink: 0,
  width: theme.sizes.toolbar.viewToggleWidth,
  maxWidth: "100%",
  height: theme.sizes.control.xl,
  margin: `${theme.space.sm}px 0`,
  border: `${theme.sizes.border.control}px solid ${theme.colours.border.default}`,
  borderRadius: theme.radius.lg,
  overflow: "hidden",
}));

// Highlighted/Selected half
const Thumb = styled("span", {
  shouldForwardProp: (prop) => prop !== "isRooms",
})<{ isRooms: boolean }>(({ theme, isRooms }) => ({
  position: "absolute",
  top: theme.space.xs,
  bottom: theme.space.xs,
  left: theme.space.xs,
  right: "auto",
  width: `calc(50% - ${theme.space.xs}px)`,
  borderRadius: theme.radius.lg,
  backgroundColor: theme.colours.accent.tertiary,
  transform: isRooms ? "translateX(100%)" : "translateX(0)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shorter,
  }),
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
}));

const Segment = styled("button")(({ theme }) => ({
  position: "relative",
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.space.sm,
  border: "none",
  backgroundColor: "transparent",
  color: theme.colours.text.primary,
  font: "inherit",
  cursor: "pointer",
  "&:focus-visible": {
    outline: `2px solid ${theme.colours.accent.primary}`,
    outlineOffset: -2,
  },
}));

const BuildingOrRoomViewToggle = ({
  view,
  onChange,
}: {
  view: BrowseView;
  onChange: (view: BrowseView) => void;
}) => (
  <Track role="radiogroup" aria-label="Browse by">
    <Thumb isRooms={view === "rooms"} />
    {OPTIONS.map(({ value, label, icon: Icon }) => (
      <Segment
        key={value}
        type="button"
        role="radio"
        aria-checked={view === value}
        onClick={() => onChange(value)}
      >
        <Icon />
        <Typography variant="subtitle1" component="span">
          {label}
        </Typography>
      </Segment>
    ))}
  </Track>
);

export default BuildingOrRoomViewToggle;
