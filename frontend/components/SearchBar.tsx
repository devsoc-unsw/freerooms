import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import React from "react";

const SearchBar = ({ setQuery }: { setQuery: (query: string) => void }) => {
  const theme = useTheme();

  return (
    <Box
      width={{ xs: "100%", sm: "100%", md: "100%" }}
      my={1}
      mx={{ sm: 2 }}
      flexShrink={{ sm: 3 }}
      order={{ xs: -1, sm: -1, md: "unset" }}
    >
      <TextField
        id="input-with-sx"
        placeholder="Looking for a free room?"
        sx={{
          "& .MuiOutlinedInput-root": {
            height: 56,
            borderRadius: "8px",
            padding: "16px",

            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.light,
            borderWidth: 2,
          },
          "& .MuiOutlinedInput-input::placeholder": {
            fontFamily: "TT Commons Pro Trial Variable",
            fontSize: 16,
            fontWeight: 500,
            color: theme.palette.primary.main,
            opacity: 1,
          },
        }}
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
            <InputAdornment position="start" sx={{ mr: "16px" }}>
              <SearchIcon
                sx={{ color: (theme) => theme.palette.primary.main }}
              />
            </InputAdornment>
          ),
        }}
        variant="outlined"
      />
    </Box>
  );
};

export default SearchBar;
