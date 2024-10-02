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
      <div></div>
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
        maxWidth: "440px",
        fontSize: { xs: "0.9em", sm: "1em" },
        fontWeight: 300,
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
        maxWidth: "440px",
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
        maxWidth: "440px",
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
