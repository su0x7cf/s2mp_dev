import { Box, Typography, Avatar, Button, Paper } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

export default function RightBarComponent() {
  return (<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", width: "100%", height: "100%", overflowY: "scroll", scrollbarWidth: "none" }}>

    <Paper sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "90%", height: "100%", my: "10px", py: "10px" }}>

      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "98%", height: "100%" }}>
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          <InfoOutlinedIcon sx={{ fontSize: "24px", color: "hsl(0, 0%, 0%, 0.6)" }} />
          <Typography variant="h6" sx={{ color: "hsl(0, 0%, 0%, 0.8)", fontSize: "18px" }}>Notifications</Typography>
        </Box>
        <ClearOutlinedIcon sx={{ fontSize: "24px", color: "hsl(0, 0%, 0%, 0.6)" }} />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", width: "100%", height: "100%" }}>
        <Typography variant="body1" sx={{ color: "hsl(0, 0%, 0%, 0.8)", pl: 5 }}>Some One Liked Your Post</Typography>
      </Box>

    </Paper>

    <Paper sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "90%", height: "100%", my: "10px", py: "10px" }}>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%" }}>
        <Typography variant="h6" sx={{ fontSize: "16px" }}>People You May Know</Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: "10px", width: "90%" }}>
        <Avatar sx={{ width: "30px", height: "30px", backgroundColor: "black" }}>A</Avatar>
        <Typography variant="body1" sx={{ fontSize: "12px" }}>Avatar Name</Typography>
        <Button variant="text" sx={{ color: "hsl(0, 0%, 0%, 0.8)", fontSize: "12px", marginLeft: "100px" }}>Follow</Button>
      </Box>
    </Paper>

  </Box>);
}
