import { Typography, Box, Button, Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useDispatch } from "react-redux";
import { setMainState } from "../../../redux/reducer/mainStateSlice";

export default function HeaderComponent() {
  const dispatch = useDispatch();
  const handleMainState = (state) => {
    dispatch(setMainState(state));
  }
  return (
    <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "98%", minHeight: "6svh"}}>
      <Typography variant="h4">S2MP</Typography>
      <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
        <Button variant="standard" size="large" onClick={() => handleMainState("profile")} sx={{display: "flex", direction: "row", alignItems: "center", justifyContent: "center", gap: 1}}>
            <Avatar>
                <PersonIcon/>
            </Avatar>
            <Typography variant="body">
                Name
            </Typography>
        </Button>
      </Box>
    </Box>
  );
}
