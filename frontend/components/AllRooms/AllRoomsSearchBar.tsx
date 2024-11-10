import SearchIcon from "@mui/icons-material/Search";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import Building from "./Building";
import When from "./When";

const AllRoomsSearchBar: React.FC<{}> = () => {
  return (
    <Stack
      direction="row"
      spacing={{ xs: 1, sm: 2 }}
      sx={{
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 3,
      }}
      divider={<Divider orientation="vertical" flexItem />}
    >
      <Building />
      <Capacity />
      <When />
      <Duration />
      <SearchIcon />
    </Stack>
  );
};

const Capacity: React.FC<{}> = () => {
  return (
    <TextField
      sx={{
        flexGrow: 1,
        maxWidth: "440px",
        fontSize: { xs: "0.9em", sm: "1em" },
        fontWeight: 300,
      }}
      type="number"
      variant="standard"
      label="Capacity"
    />
  );
};

const Duration: React.FC<{}> = () => {
  return (
    <Stack
      sx={{
        flexGrow: 1,
        maxWidth: "440px",
        fontSize: { xs: "0.9em", sm: "1em" },
        fontWeight: 300,
      }}
    >
      Duration
    </Stack>
  );
};

export default AllRoomsSearchBar;
