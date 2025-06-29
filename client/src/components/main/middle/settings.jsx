import { Box, Typography } from "@mui/material";

export default function SettingsComponent() {
    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "start", height: "1000px", width: "640px", marginX: "auto", overflow: "scroll", scrollbarWidth: "none", scrollSnapType: "y mandatory"}}>
            <Typography variant="h1">Settings</Typography>
        </Box>
    )
}
