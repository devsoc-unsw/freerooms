import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import React from "react";

const SearchBar = ({ setQuery }: { setQuery: (query: string) => void }) => {
  return (
    <Box
      width={{ xs: "100%", sm: "50%" }}
      my={1}
      mx={{ sm: 1 }}
      flexShrink={{ sm: 3 }}
      order={{ xs: -1, sm: "unset" }}
    >
      <TextField
        id="input-with-sx"
        placeholder="Search for a building..."
        fullWidth
        inputProps={{ style: { height: "12px" } }}
        //entering the target
        onKeyDown={(event) => {
          const target = event.target as HTMLInputElement;
          if (event.key === "Enter") {
            setQuery(target.value);
          }
        }}
        //clearing the search bar
        onChange={(event) => {
          if (event.target.value === "") {
            setQuery(event.target.value);
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        variant="outlined"
      />
    </Box>
  );
};

export default SearchBar;
