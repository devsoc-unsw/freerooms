import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogContent, Typography } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ setQuery }: { setQuery: (query: string) => void }) => {
  return (
    <Box sx={{ "& > :not(style)": { width: "70ch" } }}>
      <TextField
        id="input-with-sx"
        placeholder="Search for free room..."
        fullWidth
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
