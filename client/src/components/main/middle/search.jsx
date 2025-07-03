import { Box, Typography, TextField, Paper, InputAdornment, Avatar, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setMainState } from "../../../redux/reducer/mainStateSlice";

export default function SearchComponent() {
    const user = useSelector((state) => state.userState.user);
    const dispatch = useDispatch();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);
        if (value.trim() === "") {
            setResults([]);
            return;
        }
        setLoading(true);
        try {
            const res = await axios.get(`/api/v1/users/search?q=${encodeURIComponent(value)}`);
            setResults(res.data.users || []);
        } catch {
            setResults([]);
        }
        setLoading(false);
    };

    const handleFollow = async (targetUser) => {
        setFollowLoading(true);
        const isFollowing = targetUser.followers && targetUser.followers.some(f => f._id === user._id);
        if (isFollowing) {
            await axios.post(`/api/v1/users/${targetUser._id}/unfollow`, { userId: user._id });
        } else {
            await axios.post(`/api/v1/users/${targetUser._id}/follow`, { userId: user._id });
        }
        // Refresh user in results
        const res = await axios.get(`/api/v1/users/search?q=${encodeURIComponent(query)}`);
        setResults(res.data.users || []);
        setFollowLoading(false);
    };

    const handleViewProfile = (u) => {
        localStorage.setItem("profileUserId", u._id);
        dispatch(setMainState("profile"));
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", height: "1000px", width: "100%", maxWidth: "720px", marginX: "auto", overflow: "scroll", scrollbarWidth: "none", scrollSnapType: "y mandatory" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "90%", height: "10%" }}>
                <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="Search by username"
                    size="small"
                    value={query}
                    onChange={handleSearch}
                    InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
                />
            </Box>
            <Paper elevation={3} sx={{ width: "90%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", py: "20px", mb: "10px" }}>
                <Typography variant="h6">Search Results</Typography>
                {loading && <Typography>Loading...</Typography>}
                {results.length === 0 && !loading && <Typography>No results found.</Typography>}
                {results.map(u => (
                    <Paper key={u._id} elevation={2} sx={{ my: 1, width: "90%", p: 2, display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40, fontWeight: 700, fontSize: 20 }}>
                            {u.username?.[0]?.toUpperCase() || "U"}
                        </Avatar>
                        <Typography variant="body1" fontWeight={700}>{u.username}</Typography>
                        {user && user._id !== u._id && (
                            <Button
                                variant="contained"
                                size="small"
                                sx={{ ml: 2 }}
                                onClick={() => handleFollow(u)}
                                disabled={followLoading}
                            >
                                {u.followers && u.followers.some(f => f._id === user._id) ? "Unfollow" : "Follow"}
                            </Button>
                        )}
                        <Button
                            variant="outlined"
                            size="small"
                            sx={{ ml: 1 }}
                            onClick={() => handleViewProfile(u)}
                        >
                            View Profile
                        </Button>
                    </Paper>
                ))}
            </Paper>
        </Box>
    )
}
