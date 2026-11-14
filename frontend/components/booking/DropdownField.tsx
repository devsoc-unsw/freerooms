import { AppSurface } from "@frontend/components/ui";
import { ClickAwayListener } from "@mui/material";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { ReactNode, useState } from "react";

const FieldButton = styled("button")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.space.sm,
  width: "100%",
  minWidth: 0,
  height: theme.sizes.control.md,
  padding: `0 ${theme.space.md}px`,
  border: `1px solid ${theme.colours.border.default}`,
  borderRadius: theme.radius.md,
  backgroundColor: "transparent",
  color: theme.colours.text.primary,
  font: "inherit",
  textAlign: "left",
  cursor: "pointer",
  transition: theme.transitions.create("border-color", {
    duration: theme.transitions.duration.shorter,
  }),
  "&:hover, &[aria-expanded='true']": {
    borderColor: theme.colours.accent.primary,
  },
  "& svg": { flexShrink: 0 },
}));

const Dropdown = styled(AppSurface)(({ theme }) => ({
  marginTop: theme.space.xs,
  borderRadius: theme.radius.lg,
  overflow: "hidden",
  boxShadow: theme.shadows[3],
}));

// A rectangle (icon + current value) that opens a small dropdown underneath it
const DropdownField = ({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: (close: () => void, anchorWidth: number) => ReactNode;
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [anchorWidth, setAnchorWidth] = useState(0);
  const [open, setOpen] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <FieldButton
          ref={setAnchorEl}
          type="button"
          aria-expanded={open}
          onClick={(event) => {
            setAnchorWidth(event.currentTarget.offsetWidth);
            setOpen((isOpen) => !isOpen);
          }}
        >
          {icon}
          <Typography variant="filterOption" noWrap sx={{ minWidth: 0 }}>
            {label}
          </Typography>
        </FieldButton>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom-start"
          popperOptions={{ strategy: "fixed" }}
          sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
        >
          <Dropdown>{children(() => setOpen(false), anchorWidth)}</Dropdown>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default DropdownField;
