import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import FilterSideBar from "./FilterSideBar";
import { useState, useEffect } from "react";
import { AllRoomsFilters } from "types";

interface FilterSideBarProps {
  setParentFilters: React.Dispatch<React.SetStateAction<AllRoomsFilters>>;
}

const AllRoomsFilter: React.FC<FilterSideBarProps> = ({ setParentFilters }: FilterSideBarProps) => {
  const [filters, setFilters] = useState<AllRoomsFilters>({});
  useEffect(() => {
    setParentFilters(filters);
  }, [filters]);
  return (
    <StyledMainFilter>
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
        FILTER OPTIONS
      </Typography>
      <FilterSideBar/>

    </StyledMainFilter>

  );
};

const StyledMainFilter = styled(Stack)(({ theme }) => ({
  alignItems: "stretch",
  flexDirection: "column",
  flexGrow: 3,
}));

export default AllRoomsFilter;
