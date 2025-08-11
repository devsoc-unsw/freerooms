import BuildingIcon from "@mui/icons-material/Apartment";
import RoomIcon from "@mui/icons-material/MeetingRoom";
import MarkerIcon from "@mui/icons-material/Room"
import SearchIcon from "@mui/icons-material/Search";
import {
  AutocompleteRenderInputParams,
  Box,
  FilterOptionsState,
  SvgIconProps,
  useTheme,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { grey } from "@mui/material/colors";
import InputAdornment from "@mui/material/InputAdornment";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { matchSorter } from "match-sorter";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useLocalStorage } from "usehooks-ts";

import useBuildings from "../hooks/useBuildings";
import useRooms from "../hooks/useRooms";
import { setCurrentBuilding } from "../redux/currentBuildingSlice";
import { useDispatch, useSelector } from "../redux/hooks";
import { closeSearch, selectSearchOpen } from "../redux/searchOpenSlice";
import { SearchOption } from "../types";

const RECENT_SEARCH_LIMIT = 3;
interface SearchProps {}

const SearchModal: React.FC<SearchProps> = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const path = usePathname();
  const open = useSelector(selectSearchOpen);

  const [recentSearches, setRecentSearches] = useLocalStorage<SearchOption[]>(
    "recentSearches",
    []
  );

  const addRecentSearch = (newOption: SearchOption) => {
    // Check if newOption for search already exists in previous state
    setRecentSearches((prevState) => {
      const prevIndex = prevState.findIndex((prevOption) => {
        if (newOption.type === "Building" && prevOption.type === "Building") {
          return prevOption.building.id === newOption.building.id;
        } else if (newOption.type === "Room" && prevOption.type === "Room") {
          return prevOption.room.id === newOption.room.id;
        }
        return false;
      });

      const newState = [...prevState];
      if (prevIndex !== -1) {
        newState.splice(prevIndex, 1);
      }

      newState.unshift(newOption);
      return newState.slice(0, RECENT_SEARCH_LIMIT);
    });
  };

  // Fetch options
  const { buildings } = useBuildings();
  const { rooms } = useRooms();
  const options = React.useMemo(() => {
    const buildingOptions: SearchOption[] = buildings
      ? buildings.map((building) => ({
          type: "Building",
          searchKeys: [building.name, ...building.aliases, building.id],
          building,
        }))
      : [];

    const roomOptions: SearchOption[] = rooms
      ? Object.values(rooms).map((room) => ({
          type: "Room",
          searchKeys: [room.name, room.abbr, room.id],
          room,
        }))
      : [];

    return [...roomOptions, ...buildingOptions];
  }, [buildings, rooms]);

  const filterOptions = (
    options: SearchOption[],
    { inputValue }: FilterOptionsState<SearchOption>
  ) => {
    if (inputValue) {
      const filtered = matchSorter(options, inputValue, {
        keys: ["searchKeys"],
      });

      // Make sure buildings come before rooms
      const buildings = filtered.filter((opt) => opt.type === "Building");
      const rooms = filtered.filter((opt) => opt.type === "Room");
      return [...buildings, ...rooms];
    } else {
      // Return recent searches
      return recentSearches.map((option) => ({ ...option, recent: true }));
    }
  };

  const handleSelect = (
    event: React.SyntheticEvent,
    option: SearchOption | null
  ) => {
    if (!option) return;

    dispatch(closeSearch());

    if (!option.recent) {
      addRecentSearch(option);
    }

    if (option.type === "Room") {
      router.push("/room/" + option.room.id);
    } else {
      // option.type === "Building"
      if (path !== "/browse" && path !== "/map") {
        router.push("/browse");
      }
      dispatch(setCurrentBuilding(option.building));
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => dispatch(closeSearch())}
      sx={{ backdropFilter: "blur(3px)" }}
    >
      <Autocomplete
        disableCloseOnSelect
        disablePortal
        disableClearable
        openOnFocus
        onChange={handleSelect}
        options={options}
        getOptionLabel={(option) => option.searchKeys[0]}
        filterOptions={filterOptions}
        groupBy={(option) => (option.recent ? "Recent" : option.type + "s")}
        renderInput={(params) => <InputBox {...params} />}
        renderOption={(props, option) => (
          <li {...props} key={option.searchKeys[0]}>
            <SearchResult option={option} />
          </li>
        )}
        slotProps={{
          paper: { sx: { borderRadius: "0 0 10px 10px" } },
        }}
        sx={{
          maxWidth: 600,
          margin: "10% auto",
        }}
      />
    </Modal>
  );
};

const SearchResult: React.FC<{ option: SearchOption }> = ({ option }) => {
  const iconProps: SvgIconProps = {
    fontSize: "large",
    color: "primary",
  };
  const theme = useTheme();
  const router = useRouter();
  const [name, ...aliases] = option.searchKeys;

  const roomId = option.type === "Room" ? option.room.id : null;

  return (
    <Box display="flex" alignItems="center" padding={0.5} gap={2} width="100%">
      <Stack alignItems="center" justifyContent="center">
        {option.type === "Room" ? (
          <RoomIcon {...iconProps} />
        ) : (
          <BuildingIcon {...iconProps} />
        )}
      </Stack>
      <Stack direction="column">
        <Typography>{name}</Typography>
        <Typography
          variant="body2"
          color={theme.palette.mode === "light" ? grey[600] : grey[500]}
        >
          <b>AKA</b> {aliases.join(", ")}
        </Typography>
      </Stack>
     {option.type === "Room" && <Box
        sx={{
          marginLeft: "auto",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          borderRadius: "8px", // rounded square
          width: "40px",
          height: "40px",
          border: (theme) => `2px solid ${theme.palette.primary.main}`, // primary outline
          transition: "background-color 0.2s ease, border-color 0.2s ease",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)", // subtle hover fill
            borderColor: (theme) => theme.palette.primary.dark,
          },
        }}
      >
        {option.type === "Room" && (
          <MarkerIcon
            onClick={(e) => {
              router.push(`/map?roomId=${roomId}`);
              e.stopPropagation();
            }}
            fontSize="medium"
            sx={{ color: (theme) => theme.palette.warning.main }}
          />
        )}
      </Box>}
    </Box>
  );
};

const InputBox = (params: AutocompleteRenderInputParams) => {
  return (
    <TextField
      {...params}
      autoFocus
      fullWidth
      variant="standard"
      placeholder="Search a building or room..."
      InputProps={{
        ...params.InputProps,
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: undefined,
        sx: {
          backgroundColor: "background.paper",
          borderRadius: "10px 10px 0 0",
        },
        slotProps: { root: { style: { padding: 10 } } },
      }}
    />
  );
};

export default SearchModal;
