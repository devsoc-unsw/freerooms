import { styled } from "@mui/material/styles";

// Overall layout container for elements on the top bar (filters, sort, search)
const TopBar = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  margin: `${theme.space.sm}px 0`,
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  [theme.breakpoints.up("md")]: { flexWrap: "nowrap" },
}));

export default TopBar;
