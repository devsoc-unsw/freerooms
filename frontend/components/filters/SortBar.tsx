import TopBarMenu from "@frontend/components/ui/TopBarMenu";
import { DropDownItem } from "@frontend/types";
import { sortBarDropdown } from "@frontend/utils/constants";
import type { SvgIconComponent } from "@mui/icons-material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CheckIcon from "@mui/icons-material/Check";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React from "react";

const RadioMark = styled("span", {
  shouldForwardProp: (prop) => prop !== "checked",
})<{ checked: boolean }>(({ theme, checked }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
  width: theme.sizes.icon.sm,
  height: theme.sizes.icon.sm,
  fontSize: theme.sizes.icon.sm,
  border: `2px solid ${theme.colours.accent.primary}`,
  borderRadius: theme.radius.pill,
  backgroundColor: checked ? theme.colours.accent.primary : "transparent",
  color: theme.colours.text.onAccent,
  "& svg": { fontSize: "0.7em" },
}));

const SORT_ICONS: Record<string, SvgIconComponent> = {
  mostRooms: EventAvailableOutlinedIcon,
  longestAvailable: WatchLaterOutlinedIcon,
  capacity: PeopleAltOutlinedIcon,
  nearest: RoomOutlinedIcon,
  alphabetical: SortByAlphaIcon,
  reverseAlphabetical: SortByAlphaIcon,
  lowerToUpper: ArrowUpwardIcon,
  upperToLower: ArrowDownwardIcon,
};

const SortBar: React.FC<{
  sort: string;
  setSort: (sort: string) => void;
  options?: DropDownItem[]; // defaults to the building sorts that Browse uses
}> = ({ sort, setSort, options = sortBarDropdown }) => (
  <TopBarMenu
    id="browse-sort-menu"
    icon={FilterListIcon}
    label="Sort"
    title="Room Sort"
    onReset={() => setSort("alphabetical")}
  >
    {options.map((option) => {
      const Icon = SORT_ICONS[option.value];
      return (
        <FormControlLabel
          key={option.value}
          control={
            <Radio
              checked={sort === option.value}
              icon={<RadioMark checked={false} />}
              checkedIcon={
                <RadioMark checked>
                  <CheckIcon />
                </RadioMark>
              }
            />
          }
          label={
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                gap: (theme) => `${theme.space.sm}px`,
              }}
            >
              {Icon && (
                <Icon
                  fontSize="small"
                  sx={{
                    transform:
                      option.value === "reverseAlphabetical"
                        ? "scaleY(-1)"
                        : undefined,
                  }}
                />
              )}
              <Typography variant="filterOption">{option.text}</Typography>
            </Stack>
          }
          onClick={() => setSort(option.value)}
          sx={{ width: "100%", margin: 0, cursor: "pointer" }}
        />
      );
    })}
  </TopBarMenu>
);

export default SortBar;
