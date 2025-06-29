import { Box, Typography, TextField, Paper, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchComponent() {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", height: "1000px", width: "100%", maxWidth: "720px", marginX: "auto", overflow: "scroll", scrollbarWidth: "none", scrollSnapType: "y mandatory"}}>
            <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", width: "90%", height: "10%"}}>
                <TextField variant="outlined" fullWidth placeholder="Search" size="small" slotProps={{input: {startAdornment: (<InputAdornment position="start"><SearchIcon/></InputAdornment>)}}}/>
            </Box>
            <Paper elevation={3} sx={{width: "90%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", py: "20px", mb: "10px"}}>
                <Typography variant="h6">Search Results</Typography>
            </Paper>
        </Box>
    )
}
