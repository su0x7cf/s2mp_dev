//made components 
import HeaderComponent from "../components/main/header/header";
import HomeComponent from "../components/main/middle/home";
import SearchComponent from "../components/main/middle/search";
import ExploreComponent from "../components/main/middle/explore";
import MessagesComponent from "../components/main/middle/messages";
import CreateComponent from "../components/main/middle/create";
import ProfileComponent from "../components/main/middle/profile";
import RightBarComponent from "../components/main/rightbar/rightbar";
import LeftBarComponent from "../components/main/leftbar/leftbar";
//mui components
import { Container, Grid, Box, Typography, IconButton } from "@mui/material";
//mui icons
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ExploreIcon from "@mui/icons-material/Explore";
import MessageIcon from "@mui/icons-material/Message";
import PersonIcon from "@mui/icons-material/Person";
//redux components
import { useSelector, useDispatch } from "react-redux";
import { setMainState } from "../redux/reducer/mainStateSlice";
//react components


export default function MainPage() {
  const mainState = useSelector((state) => state.mainState.page);
  const dispatch = useDispatch();
  const handleMainState = (state) => {
    dispatch(setMainState(state));
  }
  return (
    <Container maxWidth="100svw" maxHeight="100svh" sx={{ p: { xs: "0px", sm: "0px", md: "0px" }, alignItems: "center", justifyContent: "center" }}>
      <Grid container sx={{ display: "flex", flexDirection: "row", alignItems: "start", justifyContent: "space-between" }}>
        <Box sx={{ display: { xs: "none", sm: "none", md: "flex", lg: "flex", xl: "flex" }, width: "100%", alignItems: "center", justifyContent: "center" }}>
          <HeaderComponent />
        </Box>
        <Grid size={{ xs: 0, sm: 0, md: 4, lg: 2, xl: 2 }} sx={{ display: { xs: "none", sm: "none", md: "flex", lg: "flex", xl: "flex" }, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <LeftBarComponent />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 8 }} sx={{ display: { xs: "flex", sm: "flex", md: "flex", lg: "flex", xl: "flex" }, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Box sx={{ display: { xs: "flex", sm: "flex", md: "none", lg: "none", xl: "none" }, flexDirection: "row", alignItems: "center", justifyContent: "center", position: "sticky", top: 0, zIndex: 1000, width: "100%" }}>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", background: "hsla(0, 0%, 100%, 1)", px: "10px" }}>
              <IconButton variant="text" color="hsla(0, 0%, 0%, 1)" sx={{ borderRadius: "3px" }} onClick={() => handleMainState("home")}>
                <Typography variant="h6" sx={{ fontSize: "20px" }}>S2MP</Typography>
              </IconButton>
              <IconButton sx={{ width: "50px", height: "50px", borderRadius: "3px" }} onClick={() => handleMainState("profile")}>
                <PersonIcon />
              </IconButton>
            </Box>
          </Box>
          {mainState == "home" ? <HomeComponent /> : mainState == "search" ? <SearchComponent /> : mainState == "explore" ? <ExploreComponent /> : mainState == "messages" ? <MessagesComponent /> : mainState == "create" ? <CreateComponent /> : mainState == "profile" ? <ProfileComponent /> : null}
          <Box sx={{ display: { xs: "flex", sm: "flex", md: "none", lg: "none", xl: "none" }, flexDirection: "row", alignItems: "center", justifyContent: "center", position: "sticky", bottom: 0, zIndex: 1000, width: "100%" }}>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-around", width: "100%", background: "hsla(0, 0%, 100%, 1)", px: "10px" }}>
              <IconButton variant="text" color="hsla(0, 0%, 0%, 1)" sx={{ width: "50px", height: "50px", borderRadius: "3px" }} onClick={() => handleMainState("home")}>
                <HomeIcon sx={{ fontSize: "20px" }} />
              </IconButton>
              <IconButton variant="text" color="hsla(0, 0%, 0%, 1)" sx={{ width: "50px", height: "50px", borderRadius: "3px" }} onClick={() => handleMainState("search")}>
                <SearchIcon sx={{ fontSize: "20px" }} />
              </IconButton>
              <IconButton variant="text" color="hsla(0, 0%, 0%, 1)" sx={{ width: "50px", height: "50px", borderRadius: "3px" }} onClick={() => handleMainState("explore")}>
                <ExploreIcon sx={{ fontSize: "20px" }} />
              </IconButton>
              <IconButton variant="text" color="hsla(0, 0%, 0%, 1)" sx={{ width: "50px", height: "50px", borderRadius: "3px" }} onClick={() => handleMainState("messages")}>
                <MessageIcon sx={{ fontSize: "20px" }} />
              </IconButton>
              <IconButton variant="text" color="hsla(0, 0%, 0%, 1)" sx={{ width: "50px", height: "50px", borderRadius: "3px" }} onClick={() => handleMainState("create")}>
                <AddIcon sx={{ fontSize: "20px" }} />
              </IconButton>
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 0, sm: 0, md: 0, lg: 2, xl: 2 }} sx={{ display: { xs: "none", sm: "none", md: "none", lg: "flex", xl: "flex" } }}>
          <RightBarComponent />
        </Grid>
      </Grid>
    </Container>
  );
}

