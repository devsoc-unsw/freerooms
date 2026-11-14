import FilterSection from "@frontend/components/filters/FilterSection";
import { DropDown } from "@frontend/types";
import { Box, Slider, Stack, Typography } from "@mui/material";
import { useState } from "react";

const FilterSlider = ({
  dropdown,
  value,
  onCommit,
}: {
  dropdown: DropDown;
  value?: string;
  onCommit: (value: string | null) => void;
}) => {
  const options: { text: string; value: string | null }[] = [
    { text: "Any", value: null },
    ...dropdown.items,
  ];
  const indexOf = (v?: string) =>
    Math.max(
      0,
      options.findIndex((option) => option.value === v)
    );

  const [prevValueProp, setPrevValueProp] = useState(value);
  const [position, setPosition] = useState(() => indexOf(value));
  if (value !== prevValueProp) {
    setPrevValueProp(value);
    setPosition(indexOf(value));
  }

  return (
    <FilterSection dropdown={dropdown}>
      <Stack
        direction="row"
        sx={(theme) => ({
          alignItems: "center",
          gap: `${theme.space.md}px`,
          paddingLeft: `${theme.space.sm}px`,
        })}
      >
        <Slider
          value={position}
          min={0}
          max={options.length - 1}
          step={1}
          marks
          valueLabelDisplay="off"
          onChange={(event, newValue) => setPosition(newValue as number)}
          onChangeCommitted={(event, newValue) =>
            onCommit(options[newValue as number].value)
          }
          sx={(theme) => {
            const railColour = theme.palette.secondary.light;
            return {
              flex: 1,
              minWidth: 0,
              height: theme.sizes.slider.rail,
              borderRadius: `${theme.radius.md}px`,
              color: theme.palette.primary.main,
              "& .MuiSlider-rail": {
                height: theme.sizes.slider.rail,
                opacity: 1,
                backgroundColor: "transparent",
                border: `1px solid ${railColour}`,
                boxSizing: "border-box",
              },
              "& .MuiSlider-track": {
                height: theme.sizes.slider.rail,
                border: "none",
                backgroundColor: theme.colours.accent.tertiary,
              },
              "& .MuiSlider-thumb": {
                width: theme.sizes.slider.thumb,
                height: theme.sizes.slider.thumb,
                borderRadius: `${theme.radius.md}px`,
                boxShadow: "none",
                "&::before": { display: "none" },
                "&::after": { borderRadius: 0 },
                "&:hover, &.Mui-focusVisible, &.Mui-active": {
                  boxShadow: "none",
                },
                "&.Mui-focusVisible": {
                  outline: `2px solid ${theme.colours.accent.primary}`,
                  outlineOffset: 2,
                },
              },
              "& .MuiSlider-mark, & .MuiSlider-markActive": {
                width: `${theme.sizes.slider.tickWidth}px`,
                height: `${theme.sizes.slider.tickHeight}px`,
                borderRadius: 0,
                backgroundColor: theme.colours.accent.secondary,
                opacity: 1,
                transform: "translateY(-50%)",
              },
            };
          }}
        />
        {/* All labels share one grid cell so the overall slider size is fixed across filters */}
        <Box sx={{ display: "grid" }}>
          {options.map((option, index) => (
            <Typography
              key={option.text}
              variant="filterOption"
              sx={{
                gridArea: "1 / 1",
                whiteSpace: "nowrap",
                visibility: index === position ? "visible" : "hidden",
              }}
            >
              {option.text}
            </Typography>
          ))}
        </Box>
      </Stack>
    </FilterSection>
  );
};

export default FilterSlider;
