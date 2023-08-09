import BuildingIcon from '@mui/icons-material/Apartment';
import RoomIcon from '@mui/icons-material/MeetingRoom';
import SearchIcon from "@mui/icons-material/Search";
import { AutocompleteRenderInputParams, FilterOptionsState, SvgIconProps } from "@mui/material";
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
import useRooms from "../hooks/useRooms";
import { setCurrentBuilding } from "../redux/currentBuildingSlice";
import { useDispatch } from "../redux/hooks";
import { BuildingSearchOption, RoomSearchOption, SearchOption } from "../types";

interface SearchProps {
  open: boolean;
  setOpen: (open: boolean) => void;
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
  const { rooms } = useRooms();
  const options = React.useMemo(() => {
    const buildingOptions: BuildingSearchOption[] = buildings
      ? buildings.map(building => ({
        type: "Building",
        searchKeys: [building.name, building.id],
        building
      }))
      : [];

    const roomOptions: RoomSearchOption[] = rooms
      ? Object.values(rooms).map(room => ({
        type: "Room",
        searchKeys: [room.name, room.abbr, room.id],
        room
      }))
      : [];

    return [...roomOptions, ...buildingOptions]
  }, [buildings, rooms])

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
    option: SearchOption | null
  ) => {
    if (!option) return;

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
        disableCloseOnSelect
        disablePortal
        disableClearable
        openOnFocus
        onChange={handleSelect}
        options={options}
        getOptionLabel={option => option.searchKeys[0]}
        filterOptions={filterOptions}
        groupBy={option => option.recent ? "Recent" : option.type + "s"}
        renderInput={(params) => <InputBox {...params} />}
        renderOption={(props, option) => (
          <li {...props} key={option.searchKeys[0]}>
            <SearchResult option={option}/>
          </li>
        )}
        slotProps={{
          paper: { sx: { borderRadius: "0 0 10px 10px" } }
        }}
        sx={{
          maxWidth: 600,
          margin: '10% auto'
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
        slotProps: { root: { style: { padding: 10 } } }
      }}
    />
  )
}

export default SearchModal;
