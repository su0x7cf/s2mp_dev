import { Box, Typography, Paper} from "@mui/material";
export default function MessagesComponent() {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", width: "100%"}}>
            <Paper sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "start", height: "100%", width: "90%", maxWidth: "600px"}}>
                <Typography variant="body3">Messages</Typography>
            </Paper>
        </Box>
    )
}
