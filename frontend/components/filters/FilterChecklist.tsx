import FilterSection from "@frontend/components/filters/FilterSection";
import { DropDown } from "@frontend/types";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const OptionGrid = styled(Box, {
  shouldForwardProp: (prop) => prop !== "columns",
})<{ columns: number }>(({ theme, columns }) => ({
  display: "grid",
  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
  gap: theme.space.sm,
}));

const Option = styled(Box, {
  shouldForwardProp: (prop) => prop !== "selected",
})<{ selected: boolean }>(({ theme, selected }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.space.sm,
  minWidth: 0,
  padding: theme.space.sm,
  border: `1px solid ${selected ? "transparent" : theme.colours.border.default}`,
  borderRadius: theme.radius.lg,
  backgroundColor: selected ? theme.colours.accent.tertiary : "transparent",
  cursor: "pointer",
  transition: theme.transitions.create(["background-color", "border-color"], {
    duration: theme.transitions.duration.shorter,
  }),
  "&:hover": { borderColor: theme.colours.accent.primary },
}));

const FilterChecklist = ({
  dropdown,
  value,
  onSelect,
  columns = 2,
}: {
  dropdown: DropDown;
  value?: string;
  onSelect: (value: string | null) => void;
  columns?: number;
}) => (
  <FilterSection dropdown={dropdown}>
    <OptionGrid columns={columns}>
      {dropdown.items.map((item) => {
        const selected = value === item.value;
        const CheckIcon = selected ? CheckBoxIcon : CheckBoxOutlineBlankIcon;
        return (
          <Option
            key={item.value}
            role="checkbox"
            aria-checked={selected}
            selected={selected}
            onClick={() => onSelect(selected ? null : item.value)}
          >
            <CheckIcon
              color="primary"
              sx={(theme) => ({ fontSize: theme.sizes.icon.sm })}
            />
            <Typography variant="filterOption" sx={{ minWidth: 0 }}>
              {item.text}
            </Typography>
          </Option>
        );
      })}
    </OptionGrid>
  </FilterSection>
);

export default FilterChecklist;
