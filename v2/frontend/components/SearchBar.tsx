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

const SearchBar = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <Box sx={{ "& > :not(style)": { m: 1, width: "70ch" } }}>
      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
        <TextField
          id="input-with-sx"
          label="Search for free room..."
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
    </Box>
  );
  /* 
  return (
    <Dialog open={open} /*BackdropComponent={()=> <Backdrop open={false}/> }>
      <DialogContent dividers>
        <Typography gutterBottom>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </Typography>

        <Typography gutterBottom>
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
          Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
        </Typography>
      </DialogContent>
    </Dialog>
  );
  */
};

export default SearchBar;
