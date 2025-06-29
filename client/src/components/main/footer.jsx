import { Typography, Box } from "@mui/material";

export default function FooterComponent() {
  return (
    <Box sx={{ alignItems: "center", justifyContent: "center", minHeight: 100, minWidth: 100, border: "1px solid black"}}>
      <Typography variant="h4">Footer</Typography>
    </Box>
  );
}
