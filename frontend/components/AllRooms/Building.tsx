import BuildingIcon from "@mui/icons-material/Apartment";
import RoomIcon from "@mui/icons-material/MeetingRoom";
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  SvgIconProps,
  TextField,
  useTheme,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useRooms from "hooks/useRooms";
import { useMemo } from "react";
import { SearchOption } from "types";

const Building: React.FC<{}> = () => {
  const handleSelect = () => {};
  const { rooms } = useRooms();

  const options = useMemo(() => {
    const roomOptions: SearchOption[] = rooms
      ? Object.values(rooms).map((room) => ({
          type: "Room",
          searchKeys: [room.name, room.abbr, room.id],
          room,
        }))
      : [];

    return roomOptions;
  }, [rooms]);

  return (
    <Autocomplete
      disablePortal
      openOnFocus
      onChange={handleSelect}
      options={options}
      getOptionLabel={(option) => option.searchKeys[0]}
      renderInput={(params) => <InputBox {...params} />}
      renderOption={(props, option) => (
        <li {...props} key={option.searchKeys[0]}>
          <SearchResult option={option} />
        </li>
      )}
      sx={{
        flexGrow: 2,
        maxWidth: "440px",
        fontSize: { xs: "0.9em", sm: "1em" },
        fontWeight: 300,
      }}
    />
  );
};

const InputBox = (params: AutocompleteRenderInputParams) => {
  return <TextField {...params} fullWidth variant="standard" label="Room" />;
};

const SearchResult: React.FC<{ option: SearchOption }> = ({ option }) => {
  const iconProps: SvgIconProps = {
    fontSize: "large",
    color: "primary",
  };
  const theme = useTheme();
  const [name, ...aliases] = option.searchKeys;

  return (
    <Stack direction="row" padding={0.5} spacing={2}>
      <Stack alignItems="center" justifyContent="center">
        <RoomIcon {...iconProps} />
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
    </Stack>
  );
};

export default Building;
