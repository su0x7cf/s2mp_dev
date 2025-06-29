import { Box, Typography } from "@mui/material";

export default function ProfileComponent() {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "start", height: "1000px", width: "640px", marginX: "auto"}}>
            <Typography variant="h1">
                Profile
            </Typography>
        </Box>
    );
}