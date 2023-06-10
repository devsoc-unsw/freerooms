import BuildingIcon from '@mui/icons-material/Apartment';
import RoomIcon from '@mui/icons-material/MeetingRoom';
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  FilterOptionsState,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import { SvgIconProps } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { matchSorter } from "match-sorter";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

import { Building } from "../types";
import { useDispatch } from "../redux/hooks";

interface SearchProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

type BuildingSearchOption = {
  type: "building";
  searchKeys: string[];
  building: Building;
}

type RoomSearchOption = {
  type: "room";
  searchKeys: string[];
  room: { id: string }; // TODO: Add room type when rooms are merged
}

type SearchOption = BuildingSearchOption | RoomSearchOption;

const options: SearchOption[] = [
  {
    type: "room",
    searchKeys: ["Quadrangle G042", "Quad G042", "K-E15-G042"],
    room: { id: "K-E15-G042" }
  },
  {
    type: "room",
    searchKeys: ["Mathews Theatre A", "MathewsThA", "K-D23-201"],
    room: { id: "K-D23-201" }
  },
  {
    type: "building",
    searchKeys: ["Ainsworth Building", "K-J17"],
    building: { name: "Mathews Theatre A", id: "K-D23-201", lat: 0, long: 0 }
  },
  {
    type: "building",
    searchKeys: ["Patricia O'Shane", "K-E19"],
    building: { name: "Patricia O'Shane", id: "K-E19", lat: 0, long: 0 }
  },
  {
    type: "room",
    searchKeys: ["Quadrangle G042a", "Quad G042", "K-E15-G042"],
    room: { id: "K-E15-G042" }
  },
  {
    type: "room",
    searchKeys: ["Mathews Theatre Aa", "MathewsThA", "K-D23-201"],
    room: { id: "K-D23-201" }
  },
  {
    type: "building",
    searchKeys: ["Ainsworth Buildinga", "K-J17"],
    building: { name: "Mathews Theatre A", id: "K-D23-201", lat: 0, long: 0 }
  },
  {
    type: "building",
    searchKeys: ["Patricia O'Shanea", "K-E19"],
    building: { name: "Patricia O'Shane", id: "K-E19", lat: 0, long: 0 }
  },
  {
    type: "room",
    searchKeys: ["Quadrangle G042b", "Quad G042", "K-E15-G042"],
    room: { id: "K-E15-G042" }
  },
  {
    type: "room",
    searchKeys: ["Mathews Theatre Ab", "MathewsThA", "K-D23-201"],
    room: { id: "K-D23-201" }
  },
  {
    type: "building",
    searchKeys: ["Ainsworth Buildingb", "K-J17"],
    building: { name: "Mathews Theatre A", id: "K-D23-201", lat: 0, long: 0 }
  },
  {
    type: "building",
    searchKeys: ["Patricia O'Shaneb", "K-E19"],
    building: { name: "Patricia O'Shane", id: "K-E19", lat: 0, long: 0 }
  },
];

const SearchModal: React.FC<SearchProps> = ({ open, setOpen }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const path = usePathname();

  const filterOptions = (
    options: SearchOption[],
    { inputValue }: FilterOptionsState<SearchOption>
  ) => {
    return inputValue
      ? matchSorter(options, inputValue, { keys: ['searchKeys'] })
      : [];
  }

  const handleSelect = (
    event: React.SyntheticEvent,
    option: string | SearchOption | null
  ) => {
    if (!option || typeof option === "string") return;

    setOpen(false);
    if (option.type === "room") {
      router.push("/room/" + option.room.id);
    } else { // option.type === "building
      if (path !== "/browse" && path !== "/map") {
        router.push("/browse");
      }
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
        disablePortal
        freeSolo
        options={options}
        filterOptions={filterOptions}
        renderInput={(params) => (
          <Paper>
            <TextField
              {...params}
              autoFocus
              placeholder="Search a building or room..."
              fullWidth
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Paper>
        )}
        getOptionLabel={option => typeof option === "string" ? option : option.searchKeys[0]}
        renderOption={(props, option) => (
          <li {...props} key={option.searchKeys[0]}>
            <SearchResult option={option}/>
          </li>
        )}
        onChange={handleSelect}
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
       {option.type === "building" ? <BuildingIcon {...iconProps} /> : <RoomIcon {...iconProps} />}
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
