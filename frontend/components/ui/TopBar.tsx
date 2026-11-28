import { styled } from "@mui/material/styles";

// Overall layout container for elements on the top bar (filters, sort, search)
const TopBar = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  gap: theme.space.md,
  margin: `${theme.space.md}px 0`,
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
}));

export default TopBar;
