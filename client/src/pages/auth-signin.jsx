import SignInComponent from "@/components/auth/signin";
import { Container, Typography } from "@mui/material";

export default function SignInPage() {
    return (
        <Container sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", height: "100%"}}>
            <Typography variant="h1" sx={{alignSelf: "flex-start", marginTop: "5vh"}}>Sign In Page</Typography>
            <SignInComponent/>
        </Container>
    );
}
