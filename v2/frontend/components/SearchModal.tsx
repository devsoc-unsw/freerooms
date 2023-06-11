import BuildingIcon from '@mui/icons-material/Apartment';
import RoomIcon from '@mui/icons-material/MeetingRoom';
import SearchIcon from "@mui/icons-material/Search";
import { FilterOptionsState, SvgIconProps } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
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
import { setCurrentBuilding } from "../redux/currentBuildingSlice";
import { useDispatch } from "../redux/hooks";
import { Building } from "../types";

interface SearchProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

// First element in searchKeys should always be name
type SearchOption = (BuildingSearchOption | RoomSearchOption) & {
  recent?: boolean;
};

type BuildingSearchOption = {
  type: "Building";
  searchKeys: string[];
  building: Building;
}

type RoomSearchOption = {
  type: "Room";
  searchKeys: string[];
  room: { id: string }; // TODO: Add room type when rooms are merged
}

const SearchModal: React.FC<SearchProps> = ({ open, setOpen }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const path = usePathname();

  const [recentSearches, setRecentSearches] = useLocalStorage<SearchOption[]>(
    "recentSearches", []
  );
  const addRecentSearch = (option: SearchOption) => {
    setRecentSearches(prevState => [option, ...prevState].slice(0, 3));
  }

  // Fetch options
  const { buildings } = useBuildings();
  const options = React.useMemo(() => {
    const buildingOptions: BuildingSearchOption[] = buildings
      ? buildings.map(building => ({
        type: "Building",
        searchKeys: [building.name, building.id],
        building
      }))
      : [];

    // TODO: Actually populate with room options
    const roomOptions: RoomSearchOption[] = [{
      type: "Room",
      searchKeys: ["Ainsworth 202", "Ainswth202", "K-J17-202"],
      room: { id: "K-J17-202" }
    }];

    return [...roomOptions, ...buildingOptions]
  }, [buildings])

  const filterOptions = (
    options: SearchOption[],
    { inputValue }: FilterOptionsState<SearchOption>
  ) => {
    if (inputValue) {
      const filtered = matchSorter(options, inputValue, { keys: ['searchKeys'] });

      // Make sure buildings come before rooms
      const buildings = filtered.filter(opt => opt.type === "Building");
      const rooms = filtered.filter(opt => opt.type === "Room");
      return [...buildings, ...rooms];
    } else {
      // Return recent searches
      return recentSearches.map(option => ({ ...option, recent: true }));
    }
  }

  const handleSelect = (
    event: React.SyntheticEvent,
    option: string | SearchOption | null
  ) => {
    if (!option || typeof option === "string") return;

    setOpen(false);

    if (!option.recent) {
      addRecentSearch(option);
    }

    if (option.type === "Room") {
      router.push("/room/" + option.room.id);
    } else { // option.type === "Building"
      if (path !== "/browse" && path !== "/map") {
        router.push("/browse");
      }
      dispatch(setCurrentBuilding(option.building))
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      sx={{ backdropFilter: "blur(3px)" }}
    >
      <Autocomplete
        sx={{
          maxWidth: 600,
          margin: '10% auto'
        }}
        disableCloseOnSelect
        disablePortal
        disableClearable
        freeSolo
        openOnFocus
        options={options}
        filterOptions={filterOptions}
        groupBy={option => option.recent ? "Recent" : option.type + "s"}
        renderInput={(params) => (
          <TextField
            {...params}
            autoFocus
            fullWidth
            variant="outlined"
            placeholder="Search a building or room..."
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: "background.paper",
                borderRadius: "10px 10px 0 0",
                padding: 2
              }
            }}
          />
        )}
        getOptionLabel={option => typeof option === "string" ? option : option.searchKeys[0]}
        renderOption={(props, option) => (
          <li {...props} key={option.searchKeys[0]}>
            <SearchResult option={option}/>
          </li>
        )}
        onChange={handleSelect}
        slotProps={{
          paper: { sx: { borderRadius: "0 0 10px 10px" } }
        }}
      />
    </Modal>
  )
}

const SearchResult: React.FC<{ option: SearchOption }> = ({ option }) => {
  const iconProps: SvgIconProps = {
    fontSize: "large",
    color: "primary"
  }

  const [name, ...aliases] = option.searchKeys;

  return (
   <Stack direction="row" padding={0.5} spacing={2}>
     <Stack alignItems="center" justifyContent="center">
       {option.type === "Room" ? <RoomIcon {...iconProps} /> : <BuildingIcon {...iconProps} />}
     </Stack>
     <Stack direction="column">
       <Typography>{name}</Typography>
       <Typography variant="body2" color="text.secondary">
         <b>AKA</b> {aliases.join(", ")}
       </Typography>
     </Stack>
   </Stack>
  )
}

export default SearchModal;
