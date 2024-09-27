import Stack from "@mui/material/Stack";

const AllRoomsSearchBar: React.FC<{}> = () => {
  return (
    <Stack
      direction="row"
      spacing={{ xs: 1, sm: 2 }}
      sx={{
        justifyContent: "center",
        flexGrow: 3,
      }}
    >
      <Building />
      <Capacity />
      <When />
      <Duration />
    </Stack>
  );
};

const Building: React.FC<{}> = () => {
  return (
    <Stack
      sx={{
        flexGrow: 1,
        maxWidth: "640px",
        fontSize: { xs: "0.9em", sm: "1em" },
        fontWeight: 300,
        paddingLeft: { xs: "0px", sm: "8px" },
      }}
    >
      Building
    </Stack>
  );
};

const Capacity: React.FC<{}> = () => {
  return (
    <Stack
      sx={{
        flexGrow: 1,
        maxWidth: "320px",
        fontSize: { xs: "0.9em", sm: "1em" },
        fontWeight: 300,
      }}
    >
      Capacity
    </Stack>
  );
};

const When: React.FC<{}> = () => {
  return (
    <Stack
      sx={{
        flexGrow: 1,
        maxWidth: "320px",
        fontSize: { xs: "0.9em", sm: "1em" },
        fontWeight: 300,
      }}
    >
      When
    </Stack>
  );
};

const Duration: React.FC<{}> = () => {
  return (
    <Stack
      sx={{
        flexGrow: 1,
        maxWidth: "320px",
        fontSize: { xs: "0.9em", sm: "1em" },
        fontWeight: 300,
      }}
    >
      Duration
    </Stack>
  );
};

export default AllRoomsSearchBar;
