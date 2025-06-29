import { Card, CardContent, TextField, Button, Divider, Box, Typography } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";

export default function SignUpComponent() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const nameChangeHandler = function(event) {
        setName(event.target.value);
    }
    const emailChangeHandler = function(event) {
        setEmail(event.target.value);
    }
    const passwordChangeHandler = function(event) {
        setPassword(event.target.value);
    }
    const handleSubmit = async function() {
        const response = await axios.post("/api/v1/auth/register", { name, email, password });
        console.log(response.data);
        window.location.href = "/auth-signin";
    }
    return (
        <>
        <Card sx={{minWidth: "400px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "200px"}}>
            <CardContent sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", width: "80%"}}>
                <Typography variant="h5" sx={{mb: 1, alignSelf: "flex-start"}}>Hi, create an account</Typography>
                <Typography variant="h6" sx={{mb: 2, alignSelf: "flex-start"}}>Sign up for an S2MP account</Typography>
                <Box sx={{display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center", minWidth: "100%"}}>
                    <TextField label="Name" type="Name" onChange={nameChangeHandler} fullWidth required sx={{mb: 2}}/>
                    <TextField label="Email" type="email" onChange={emailChangeHandler} fullWidth required sx={{mb: 2}}/>
                    <TextField label="Password" type="password" onChange={passwordChangeHandler} fullWidth required sx={{mb: 2}}/>
                    <Button type="submit" variant="outlined" onClick={handleSubmit} fullWidth sx={{borderColor: "hsl(0, 0.00%, 70%)", color: "hsl(0, 0.00%, 20%)", mb: 2, p: 1,}}>Sign Up</Button>
                </Box>
                <Divider orientation="horizontal" flexItem sx={{mb: 2, width: "100%"}}>or continue with</Divider>
                <Box fullWidth sx={{display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center"}}>
                    <Button variant="outlined" fullWidth sx={{borderColor: "hsl(0, 0.00%, 70%)", color: "hsl(0, 0.00%, 20%)", mb: 2, p: 1,  minWidth: "100%"}} >Sign Up with Google</Button>
                    <Button variant="outlined" fullWidth sx={{borderColor: "hsl(0, 0.00%, 70%)", color: "hsl(0, 0.00%, 20%)", mb: 2, p: 1,  minWidth: "100%"}}>Sign Up with Facebook</Button>
                </Box>
                <Typography sx={{color: "hsl(0, 0.00%, 40%)"}}>Already have an account? <Link href="/auth-signin" style={{textDecoration: "underline", textDecorationColor: "hsl(113, 53.70%, 81.40%)", color: "hsl(0, 0.00%, 20%)"}}>Sign In</Link></Typography>
            </CardContent>
        </Card>
    </>
    );
}
