import { AppButton, AppSurface } from "@frontend/components/ui";
import { useTopBarGroup } from "@frontend/components/ui/TopBarGroup";
import type { SvgIconComponent } from "@mui/icons-material";
import { ClickAwayListener } from "@mui/material";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Stack from "@mui/material/Stack";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { ReactNode, useState } from "react";

const Panel = styled(AppSurface, {
  shouldForwardProp: (prop) => prop !== "panelWidth",
})<{ panelWidth: number }>(({ theme, panelWidth }) => ({
  width: panelWidth,
  maxWidth: `calc(100vw - ${theme.space.lg}px)`,
  maxHeight: "70vh",
  overflowX: "hidden",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  padding: `0 ${theme.space.md}px ${theme.space.md}px`,
  marginTop: theme.space.xs,
  borderRadius: theme.radius.lg,
  // Sections keep their natural height and the panel scrolls
  "& > *": { flexShrink: 0 },
}));

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: theme.sizes.control.xl,
}));

type TopBarMenuProps = {
  id: string; // used for aria-controls
  icon: SvgIconComponent;
  label: string; // text on the button
  title: string; // Title on the actual dropdown
  onReset?: () => void;
  placement?: "bottom-start" | "bottom-end"; // which edge of the row the panel lines up with
  wide?: boolean;
  children: ReactNode;
};

const TopBarMenu = ({
  id,
  icon: Icon,
  label,
  title,
  onReset,
  placement = "bottom-start",
  wide = false,
  children,
}: TopBarMenuProps) => {
  const theme = useTheme();
  const groupElement = useTopBarGroup();
  const [buttonBox, setButtonBox] = useState<HTMLElement | null>(null);
  const [rowWidth, setRowWidth] = useState(0);
  const [open, setOpen] = useState(false);

  const anchorEl = groupElement ?? buttonBox;

  const overhang = theme.space.xl;
  const skidding = placement === "bottom-start" ? -overhang : 0;

  let panelWidth: number = theme.sizes.toolbar.menuWidth;
  if (wide) {
    panelWidth = theme.sizes.toolbar.wideMenuWidth;
  } else if (groupElement) {
    panelWidth = rowWidth + overhang;
  }

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box ref={setButtonBox} sx={{ alignSelf: "center" }}>
        <AppButton
          variant="outlined"
          aria-expanded={open}
          aria-controls={open ? id : undefined}
          onClick={() => {
            setRowWidth(groupElement?.offsetWidth ?? 0);
            setOpen((isOpen) => !isOpen);
          }}
          sx={(theme) => ({
            height: theme.sizes.control.xl,
            width: theme.sizes.toolbar.buttonWidth,
            padding: `${theme.space.md}px`,
            justifyContent: "flex-start",
          })}
        >
          <Stack
            direction="row"
            sx={{ alignItems: "center", gap: (theme) => `${theme.space.md}px` }}
          >
            <Icon />
            <Typography variant="subtitle1">{label}</Typography>
          </Stack>
        </AppButton>

        <Popper
          open={open}
          anchorEl={anchorEl}
          placement={placement}
          popperOptions={{ strategy: "fixed" }}
          modifiers={[
            { name: "offset", options: { offset: [skidding, 0] } },
            {
              name: "preventOverflow",
              options: { altAxis: true, padding: theme.space.sm },
            },
          ]}
          sx={{ zIndex: theme.zIndex.modal }}
        >
          <Panel id={id} panelWidth={panelWidth}>
            <Header>
              <Typography variant="h4">{title}</Typography>
              {onReset && (
                <Typography
                  variant="body1"
                  color="primary"
                  sx={{ cursor: "pointer" }}
                  onClick={onReset}
                >
                  Reset
                </Typography>
              )}
            </Header>
            {children}
          </Panel>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};

export default TopBarMenu;
