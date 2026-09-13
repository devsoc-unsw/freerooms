import FilterSideBar from "@frontend/components/filters/FilterSideBar";
import useAllRoomsQuery from "@frontend/hooks/useAllRoomsQuery";
import useDateTimeQuery from "@frontend/hooks/useDateTimeQuery";
import { clearAllRoomsFilters } from "@frontend/redux/allRoomsFilterSlice";
import { useDispatch } from "@frontend/redux/hooks";
import { AllRoomsFilters } from "@frontend/types";
import { Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";

const AllRoomsFilter: React.FC<{ filters: AllRoomsFilters }> = ({
  filters,
}) => {
  const dispatch = useDispatch();

  // Apply redux filters to URL query parameters
  useAllRoomsQuery();
  useDateTimeQuery();

  return (
    <StyledMainFilter>
      <Stack
        direction="row"
        sx={{
          alignContent: "center",
          alignItems: "center",
          justifyContent: "space-between",
        }}
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
          onClick={() => dispatch(clearAllRoomsFilters())}
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
  flexGrow: 0,
}));

export default AllRoomsFilter;
