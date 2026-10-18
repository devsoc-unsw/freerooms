import { AppTextField } from "@frontend/components/ui";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useRef } from "react";

const DEBOUNCE_MS = 0;

const SearchBar = ({ setQuery }: { setQuery: (query: string) => void }) => {
  const theme = useTheme();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPending = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // clean up any pending timer on unmount
  useEffect(() => clearPending, []);

  return (
    <Box
      sx={(theme) => ({
        width: { xs: "100%", sm: "100%", md: "100%" },
        marginTop: `${theme.space.sm}px`,
        marginBottom: `${theme.space.sm}px`,
        marginLeft: { sm: `${theme.space.md}px` },
        marginRight: { sm: `${theme.space.md}px` },
        flexShrink: { sm: 3 },
        order: { xs: -1, sm: -1, md: "unset" },
      })}
    >
      <AppTextField
        id="input-with-sx"
        placeholder="Search for a building..."
        sx={{
          "& .MuiOutlinedInput-root": {
            height: theme.sizes.control.xl,
            borderRadius: theme.radius.lg,
            padding: `${theme.space.md}px`,

            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
            borderWidth: 1,
          },
          "& .MuiOutlinedInput-input::placeholder": {
            fontSize: 16,
            fontWeight: 500,
            color: theme.palette.primary.main,
            opacity: 1,
          },
        }}
        fullWidth

        // debounce: send the query 0ms after the last key up
        onKeyUp={(event) => {
          const target = event.target as HTMLInputElement;
          clearPending();

          // pressing enter submits immediately
          if (event.key === "Enter") {
            setQuery(target.value);
            return;
          }
          const value = target.value;
          timeoutRef.current = setTimeout(() => {
            setQuery(value);
            timeoutRef.current = null;
          }, DEBOUNCE_MS);
        }}

        //clearing the search bar
        onChange={(event) => {
          if (event.target.value === "") {
            setQuery(event.target.value);
          }
        }}
        variant="outlined"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment
                position="start"
                sx={{ marginRight: `${theme.space.md}px` }}
              >
                <SearchIcon
                  sx={{ color: (theme) => theme.palette.primary.main }}
                />
              </InputAdornment>
            ),
          },
          htmlInput: { style: { height: "12px" } },
        }}
      />
    </Box>
  );
};

export default SearchBar;
