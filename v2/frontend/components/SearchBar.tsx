import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import React from "react";

const SearchBar = ({ setQuery }: { setQuery: (query: string) => void }) => {
  return (
    <Box id={"SearchBox"}>
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
