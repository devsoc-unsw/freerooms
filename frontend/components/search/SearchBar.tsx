import { AppTextField } from "@frontend/components/ui";
import { getOutlinedFieldStyles } from "@frontend/theme/fieldStyles";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useRef } from "react";

const DEBOUNCE_MS = 100;

const SearchBar = ({
  setQuery,
  placeholder = "Search for a building...",
}: {
  setQuery: (query: string) => void;
  placeholder?: string;
}) => {
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
        placeholder={placeholder}
        sx={[
          getOutlinedFieldStyles(theme),
          {
            "& .MuiOutlinedInput-root": {
              height: theme.sizes.control.xl,
              borderRadius: theme.radius.md,
              padding: `${theme.space.md}px`,
            },
            "& .MuiOutlinedInput-input::placeholder":
              theme.typography.subtitle1,
          },
        ]}
        fullWidth

        // debounce: send the query 100ms after the last key up
        onChange={(event) => {
          const value = event.target.value;
          clearPending();
          timeoutRef.current = setTimeout(() => {
            setQuery(value);
            timeoutRef.current = null;
          }, DEBOUNCE_MS);
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
                  sx={{ color: (theme) => theme.colours.text.primary }}
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
