import { Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import { clearFilters } from "redux/filtersSlice";
import { useDispatch } from "redux/hooks";
import { AllRoomsFilters } from "types";

import FilterSideBar from "./FilterSideBar";

const AllRoomsFilter: React.FC<{ filters: AllRoomsFilters }> = ({
  filters,
}) => {
  const dispatch = useDispatch();

  return (
    <StyledMainFilter>
      <Stack
        alignContent="center"
        alignItems="center"
        direction="row"
        justifyContent="space-between"
      >
        <Typography
          sx={{
            color: "primary.main",
            width: "fit-content",
            marginRight: 2,
            fontWeight: 500,
            fontSize: "0.85rem",
            paddingBottom: "4px",
          }}
        >
          FILTER
        </Typography>
        <Button
          size="small"
          sx={{ position: "relative", bottom: 3 }}
          onClick={() => dispatch(clearFilters())}
        >
          RESET
        </Button>
      </Stack>
      <FilterSideBar filters={filters} />
    </StyledMainFilter>
  );
};

const StyledMainFilter = styled(Stack)(({ theme }) => ({
  alignItems: "stretch",
  flexDirection: "column",
  flexGrow: 3,
}));

export default AllRoomsFilter;
