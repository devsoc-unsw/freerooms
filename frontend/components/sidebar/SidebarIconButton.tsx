import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import Link from "next/link";

interface SidebarItemProps {
  icon: React.ReactElement;
  label: string;
  href: string;
  sidebarOpen: boolean;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  href,
  sidebarOpen,
  active,
}) => {
  return (
    <Tooltip title={!sidebarOpen ? label : ""} placement="right">
      <ListItem disablePadding sx={{ display: "block", marginBottom: 1 }}>
        <ListItemButton
          disableRipple
          selected={active}
          LinkComponent={Link}
          href={href}
          sx={[
            {
              minHeight: 48,
              px: 2.5,
              justifyContent: "center",
              borderRadius: "8px",
            },
            sidebarOpen
              ? {
                  justifyContent: "initial",
                }
              : {
                  justifyContent: "center",
                },
          ]}
        >
          <ListItemIcon
            sx={[
              {
                minWidth: 0,
                justifyContent: "center",
              },
              sidebarOpen
                ? {
                    mr: 3,
                  }
                : {
                    mr: "auto",
                  },
            ]}
          >
            {icon}
          </ListItemIcon>
          <ListItemText
            primary={label}
            sx={[
              sidebarOpen
                ? {
                    opacity: 1,
                  }
                : {
                    opacity: 0,
                  },
            ]}
          />
        </ListItemButton>
      </ListItem>
    </Tooltip>
  );
};

export default SidebarItem;
