import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import { AllRoomsFilters } from "types";

import FilterSideBar from "./FilterSideBar";

const AllRoomsFilter: React.FC<{}> = () => {
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
      <FilterSideBar />
    </StyledMainFilter>
  );
};

const StyledMainFilter = styled(Stack)(({ theme }) => ({
  alignItems: "stretch",
  flexDirection: "column",
  flexGrow: 3,
}));

export default AllRoomsFilter;
