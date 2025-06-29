import SignUpComponent from "@/components/auth/signup";
import { Container, Typography } from "@mui/material";

export default function SignUpPage() {
    return (
        <Container sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", height: "100%"}}>
            <Typography variant="h1" sx={{alignSelf: "flex-start", marginTop: "5vh"}}>Sign Up Page</Typography>
            <SignUpComponent/>
        </Container>
    );
}
