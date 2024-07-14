import SearchIcon from "@mui/icons-material/Search";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/system";

export default function Page() {
  return (
    <Container>
      <Stack>
        <SearchBar />
        <Stack
          direction="row"
          style={{
            flexWrap: "wrap",
            borderStyle: "solid",
            borderRadius: 3,
            borderColor: "black",
            borderWidth: "thin",
            marginLeft: 40,
            marginRight: 40,
            paddingRight: 16,
          }}
        >
          <Stack>
            <span
              style={{
                fontWeight: "bold",
                paddingLeft: 6,
              }}
            >
              Filter by:
            </span>
            <SubFilter />
          </Stack>
          <RoomList />
        </Stack>
      </Stack>
    </Container>
  );
}

const MainFilter: React.FC<{}> = () => {
  return (
    <Stack
      direction="row"
      spacing={2}
      divider={<Divider orientation="vertical" flexItem />}
      style={{}}
    >
      <Building />
      <Capacity />
      <When />
      <Duration />
    </Stack>
  );
};

const SearchBar: React.FC<{}> = () => {
  return (
    <Stack direction="row">
      <MainFilter />
      <SearchButton />
    </Stack>
  );
};

const SubFilter: React.FC<{}> = () => {
  return (
    <Stack
      spacing={1}
      divider={<Divider orientation="horizontal" flexItem />}
      style={{
        padding: 3,
      }}
    >
      <RoomType />
      <Location />
      <IDRequired />
    </Stack>
  );
};

const RoomList: React.FC<{}> = () => {
  return (
    <Stack
      style={{
        borderStyle: "solid",
        borderRadius: 3,
        borderColor: "black",
        borderWidth: "thin",
        fontFamily: "Roboto",
      }}
    >
      Ainsworth G03 Available Until 1:00pm
    </Stack>
  );
};

const Building: React.FC<{}> = () => {
  return <Stack>Building</Stack>;
};

const Capacity: React.FC<{}> = () => {
  return <Stack>Capacity</Stack>;
};

const When: React.FC<{}> = () => {
  return <Stack>When</Stack>;
};

const Duration: React.FC<{}> = () => {
  return <Stack>Duration</Stack>;
};

const SearchButton: React.FC<{}> = () => {
  return (
    <Stack>
      <SearchIcon />
    </Stack>
  );
};

const RoomType: React.FC<{}> = () => {
  return <Stack>Room Type</Stack>;
};

const Location: React.FC<{}> = () => {
  return <Stack>Location</Stack>;
};

const IDRequired: React.FC<{}> = () => {
  return <Stack>ID Required</Stack>;
};

const StyledSearchBar = styled(SearchBar)(({ theme }) => ({
  minWidth: 0,
  borderStyle: "solid",
  borderRadius: 7,
  borderColor: "black",
  borderWidth: "thin",
  marginTop: 48,
  marginLeft: 32,
  marginRight: 32,
  marginBottom: 30,
  padding: 10,
  justifyContent: "space-between",
}));
