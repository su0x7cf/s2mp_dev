import { Box, Typography, Button, Paper, Avatar } from "@mui/material";
import { useDispatch } from "react-redux";
import { setMainState } from "../../../redux/reducer/mainStateSlice";

export default function LeftBarComponent() {
    const dispatch = useDispatch();
    const handleMainState = (state) => {
        dispatch(setMainState(state));
    }
    return (<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", width: "100%", overflow: "scroll", scrollbarWidth: "none" }}>
        <Paper sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "start", width: "90%", height: "100%", marginY: "5px" }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "start", gap: 2, width: "100%", py: 2 }}>
                <Button onClick={() => handleMainState("home")}>
                    <Typography variant="h4" fontSize={"2rem"}>Home</Typography>
                </Button>
                <Button onClick={() => handleMainState("search")}>
                    <Typography variant="h4" fontSize={"2rem"}>Search</Typography>
                </Button>
                <Button onClick={() => handleMainState("explore")}>
                    <Typography variant="h4" fontSize={"2rem"}>Explore</Typography>
                </Button>
                <Button onClick={() => handleMainState("messages")}>
                    <Typography variant="h4" fontSize={"2rem"}>Messages</Typography>
                </Button>
                <Button onClick={() => handleMainState("create")}>
                    <Typography variant="h4" fontSize={"2rem"}>Create</Typography>
                </Button>
            </Box>
        </Paper>
        <Paper sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", width: "90%", height: "100%", marginY: "5px" }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, width: "100%", py: 5 }}>
                <Avatar src="https://via.placeholder.com/150" sx={{ width: "120px", height: "120px" }} />
                <Typography variant="body1">John Doe</Typography>
                <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 1, width: "100%", mt: "10px" }}>
                    <Typography variant="body2" sx={{ width: "40%", textAlign: "center" }}>Friends 12</Typography>
                    <Typography variant="body2" sx={{ width: "40%", textAlign: "center" }}>Posts 18</Typography>
                    <Typography variant="body2" sx={{ width: "40%", textAlign: "center" }}>Followers 306</Typography>
                    <Typography variant="body2" sx={{ width: "40%", textAlign: "center" }}>Following 120</Typography>
                </Box>
            </Box>
        </Paper>
    </Box>
    );
}
