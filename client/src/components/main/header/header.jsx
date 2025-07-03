import { Typography, Box, Button, Avatar, Menu, MenuItem, IconButton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useSelector, useDispatch } from "react-redux";
import { setMainState } from "../../../redux/reducer/mainStateSlice";
import { setUser, setIsLoggedIn } from "../../../redux/reducer/userStateSlice";
import cookies from "js-cookie";
import { useRouter } from "next/router";
import { useState } from "react";

export default function HeaderComponent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.userState.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleProfile = () => {
    dispatch(setMainState("profile"));
    handleClose();
  };
  const handleLogout = () => {
    cookies.remove("token");
    dispatch(setUser(null));
    dispatch(setIsLoggedIn(false));
    router.replace("/auth-signin");
    handleClose();
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "98%", minHeight: "6svh" }}>
      <Typography variant="h4">S2MP</Typography>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <IconButton onClick={handleMenu} sx={{ display: "flex", direction: "row", alignItems: "center", justifyContent: "center", gap: 1 }}>
          <Avatar src={user && user.avatar ? `/download/${user.avatar}` : undefined}>
            {(!user?.avatar && user?.username?.[0]) ? user.username[0].toUpperCase() : <PersonIcon />}
          </Avatar>
          <Typography variant="body">
            {user ? user.username : "Username"}
          </Typography>
          <ArrowDropDownIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: "red" }}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
