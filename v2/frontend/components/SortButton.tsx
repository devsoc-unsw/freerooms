import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";

const Sort = styled(Select)(({ theme }) => ({
  borderRadius: "10px",
  backgroundColor: "#eee",
  color: "#333",
  textTransform: "none",
  transition: "all 0.1s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
  },
}));
export default Sort;
