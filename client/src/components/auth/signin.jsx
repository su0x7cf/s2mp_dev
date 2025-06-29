import { Box, Card, CardContent, TextField, Typography, Button, Divider } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { MuiOtpInput } from "mui-one-time-password-input";
import cookies from "js-cookie";
//redux components
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/reducer/userStateSlice";

export default function SignInComponent() {
    const userState = useSelector((state) => state.userState.user);
    const dispatch = useDispatch();
    const handleUserState = (state) => {
        dispatch(setUser(state));
    }
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [twoFactorCode, setTwoFactorCode] = useState("");

    //logic for form data
    const emailChangeHandler = function (event) {
        setEmail(event.target.value);
    }
    const passwordChangeHandler = function (event) {
        setPassword(event.target.value);
    }
    const handleSignIn = async function () {
        const response = await axios.post("/api/v1/auth/login", { email, password });
        //check if two factor authentication is enabled
        if (response.data.user.twoFactorEnabled) {
            setTwoFactorEnabled(true);
        }
        else {
            handleUserState(response.data.user);
            cookies.set("token", response.data.token);
            window.location.href = "/main";
        }
    }

    //logic for two factor authentication
    const twoFactorCodeChangeHandler = function (event) {
        setTwoFactorCode(event.target.value);
    }
    const handleSendToEmail = async function () {
        const response = await axios.post("/api/v1/auth/2fa/send-to-email", { email });
        console.log("Response: ", response.data);
    }
    const handleSendToPhone = async function () {
        const response = await axios.post("/api/v1/auth/2fa/send-to-phone", { phone: response.data.user.phone });
        console.log("Response: ", response.data);
    }
    const handleVerify = async function () {
        const response = await axios.post("/api/v1/auth/2fa/verify", { email, twoFactorCode });
        console.log("Response: ", response.data);
        handleUserState(response.data.user);
        cookies.set("token", response.data.token);
        window.location.href = "/main";
    }
    return (
        <>
            <Card sx={{ minWidth: "400px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "200px" }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", width: "80%" }}>
                    {!twoFactorEnabled ?
                        (<>
                            <Typography variant="h5" sx={{ mb: 1, alignSelf: "flex-start" }}>Welcome Back </Typography>
                            <Typography variant="h6" sx={{ mb: 2, alignSelf: "flex-start" }}>Sign in to your S2MP account</Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center", minWidth: "100%" }}>
                                <TextField label="Email" type="email" onChange={emailChangeHandler} fullWidth required sx={{ mb: 2 }} />
                                <TextField label="Password" type="password" onChange={passwordChangeHandler} fullWidth required sx={{ mb: 2 }} />
                                <Button type="submit" variant="outlined" fullWidth onClick={handleSignIn} sx={{ borderColor: "hsl(0, 0.00%, 70%)", color: "hsl(0, 0.00%, 20%)", mb: 2, p: 1, }}>Sign In</Button>
                            </Box>
                            <Divider orientation="horizontal" flexItem sx={{ mb: 2, width: "100%" }}>or continue with</Divider>
                            <Box fullWidth sx={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center" }}>
                                <Button variant="outlined" fullWidth sx={{ borderColor: "hsl(0, 0.00%, 70%)", color: "hsl(0, 0.00%, 20%)", mb: 2, p: 1, minWidth: "100%" }} >Sign In with Google</Button>
                                <Button variant="outlined" fullWidth sx={{ borderColor: "hsl(0, 0.00%, 70%)", color: "hsl(0, 0.00%, 20%)", mb: 2, p: 1, minWidth: "100%" }}>Sign In with Facebook</Button>
                            </Box>
                            <Typography sx={{ color: "hsl(0, 0.00%, 40%)" }}>Don't have an account? <Link href="/auth-signup" style={{ textDecoration: "underline", textDecorationColor: "hsl(113, 53.70%, 81.40%)", color: "hsl(0, 0.00%, 20%)" }}>Sign up</Link></Typography>
                        </>)
                        :
                        (<>
                            <Typography variant="h5" sx={{ mb: 1, alignSelf: "flex-start", marginBottom: 2 }}>Two Factor Authentication</Typography>
                            <Box sx={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "center", alignItems: "center", gap: 2 }}>
                                <Button variant="outlined" onClick={handleSendToEmail} fullWidth sx={{ borderColor: "hsl(0, 0.00%, 70%)", color: "hsl(0, 0.00%, 20%)", mb: 2, p: 1, minWidth: "30%" }}>Send to email</Button>
                                <Button variant="outlined" onClick={handleSendToPhone} fullWidth sx={{ borderColor: "hsl(0, 0.00%, 70%)", color: "hsl(0, 0.00%, 20%)", mb: 2, p: 1, minWidth: "30%" }}>Send to phone</Button>
                            </Box>
                            <TextField label="Code" type="text" onChange={twoFactorCodeChangeHandler} fullWidth required sx={{ mb: 2 }} />
                            <MuiOtpInput value={twoFactorCode} onChange={twoFactorCodeChangeHandler} length={6} autoFocus variant="outlined" style={{ marginBottom: "15px", width: "80%" }} />
                            <Button type="verify" variant="outlined" fullWidth onClick={handleVerify} sx={{ borderColor: "hsl(0, 0.00%, 70%)", color: "hsl(0, 0.00%, 20%)", mb: 2, p: 1, }}>Verify</Button>
                        </>)}
                </CardContent>
            </Card>
        </>
    );
}
