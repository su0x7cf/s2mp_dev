import { Box, Typography, Paper, Button, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import FullContentViewer from "./fullContentViewer";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setMainState } from "../../../redux/reducer/mainStateSlice";

export default function ExploreComponent() {
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [fullContentViewer, setFullContentViewer] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const user = useSelector((state) => state.userState.user);
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [userStates, setUserStates] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // On mount or when search changes, fetch users from backend
        let ignore = false;
        const fetchUsers = async () => {
            setLoading(true);
            try {
                let users = [];
                if (search.trim() === "") {
                    // Optionally, fetch all users or a default set
                    const res = await axios.get("/api/v1/users/search?q=");
                    users = res.data.users;
                } else {
                    const res = await axios.get(`/api/v1/users/search?q=${encodeURIComponent(search)}`);
                    users = res.data.users;
                }
                // For each user, fetch followers/following
                const userStatesData = await Promise.all(users.map(async (u) => {
                    const [followersRes, followingRes] = await Promise.all([
                        axios.get(`/api/v1/users/${u._id}/followers`).catch(() => ({ data: { followers: [] } })),
                        axios.get(`/api/v1/users/${u._id}/following`).catch(() => ({ data: { following: [] } })),
                    ]);
                    return {
                        ...u,
                        followers: followersRes.data.followers || [],
                        following: followingRes.data.following || [],
                        isFollowing: user ? (followersRes.data.followers || []).some(f => f._id === user._id) : false,
                    };
                }));
                if (!ignore) setUserStates(userStatesData);
            } catch {
                if (!ignore) setUserStates([]);
            }
            setLoading(false);
        };
        fetchUsers();
        // Fetch all posts for explore
        axios.get("/api/v1/posts/all")
            .then(res => {
                setPosts((res.data.posts || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            })
            .catch(() => setPosts([]))
            .finally(() => setLoadingPosts(false));
        return () => { ignore = true; };
    }, [search, user]);

    const handleFollow = async (targetId, idx) => {
        if (!user) return;
        const isFollowing = userStates[idx].isFollowing;
        if (isFollowing) {
            await axios.post(`/api/v1/users/${targetId}/unfollow`, { userId: user._id });
        } else {
            await axios.post(`/api/v1/users/${targetId}/follow`, { userId: user._id });
        }
        // Refresh that user's followers/following
        const [followersRes, followingRes] = await Promise.all([
            axios.get(`/api/v1/users/${targetId}/followers`).catch(() => ({ data: { followers: [] } })),
            axios.get(`/api/v1/users/${targetId}/following`).catch(() => ({ data: { following: [] } })),
        ]);
        setUserStates(prev => prev.map((u, i) => i === idx ? {
            ...u,
            followers: followersRes.data.followers || [],
            following: followingRes.data.following || [],
            isFollowing: user ? (followersRes.data.followers || []).some(f => f._id === user._id) : false,
        } : u));
    };
    // Replace handleViewProfile to open a dialog overlay
    const handleViewProfile = (u) => {
        setSelectedUser(u);
        setUserDialogOpen(true);
    };

    const filteredUsers = userStates.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Explore Users</Typography>
            <TextField
                label="Search users"
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ mb: 2, width: 300 }}
            />
            {loading ? <Typography>Loading...</Typography> : null}
            <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, mb: 4 }}>
                {userStates.map((u, idx) => (
                    <Paper key={u._id} sx={{ p: 2, minWidth: 200, display: "flex", flexDirection: "column", alignItems: "center", gap: 1, cursor: "pointer" }}>
                        <Avatar sx={{ width: 48, height: 48 }}>{u.username[0]}</Avatar>
                        <Typography>{u.username}</Typography>
                        <Button
                            variant={u.isFollowing ? "outlined" : "contained"}
                            color={u.isFollowing ? "secondary" : "primary"}
                            sx={{ mt: 1, mb: 1 }}
                            onClick={() => handleFollow(u._id, idx)}
                            disabled={user && user._id === u._id}
                        >
                            {u.isFollowing ? "Unfollow" : "Follow"}
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            sx={{ mb: 1 }}
                            onClick={() => handleViewProfile(u)}
                        >
                            View Profile
                        </Button>
                        <Typography variant="caption"><b>{u.followers.length}</b> Followers</Typography>
                        <Typography variant="caption"><b>{u.following.length}</b> Following</Typography>
                    </Paper>
                ))}
            </Box>
            {/* User Dialog for followers/following and profile navigation */}
            <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)}>
                <DialogTitle>{selectedUser?.username}'s Profile</DialogTitle>
                <DialogContent>
                    <Typography variant="subtitle1">Followers</Typography>
                    {selectedUser?.followers.length === 0 ? <Typography>No followers yet.</Typography> : selectedUser?.followers.map(f => (
                        <Box key={f._id} sx={{ display: "flex", alignItems: "center", gap: 1, my: 0.5 }}>
                            <Avatar sx={{ width: 24, height: 24 }}>{f.username?.[0]?.toUpperCase() || "U"}</Avatar>
                            <Typography>{f.username}</Typography>
                        </Box>
                    ))}
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Following</Typography>
                    {selectedUser?.following.length === 0 ? <Typography>Not following anyone yet.</Typography> : selectedUser?.following.map(f => (
                        <Box key={f._id} sx={{ display: "flex", alignItems: "center", gap: 1, my: 0.5 }}>
                            <Avatar sx={{ width: 24, height: 24 }}>{f.username?.[0]?.toUpperCase() || "U"}</Avatar>
                            <Typography>{f.username}</Typography>
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUserDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            <Typography variant="h6" sx={{ mb: 2 }}>Explore Posts</Typography>
            {loadingPosts ? <Typography>Loading posts...</Typography> : null}
            <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "center", height: "100%", width: "100%", overflow: "scroll", scrollbarWidth: "none", scrollSnapType: "y mandatory" }}>
                {posts.map((post, index) => (
                    <Paper key={post._id || index} onClick={() => setCurrentPost(post)} elevation={3} sx={{ display: "flex", width: "30%", height: "100%", my: "4px", mx: "4px", justifyContent: "center", alignItems: "center" }}>
                        {post.type === "image" && <img src={post.downloadUrl || `/uploads/${post.src}`} alt={post.caption || "post"} style={{ objectFit: "cover", objectPosition: "center", width: "100%", aspectRatio: "1/1" }} />}
                        {post.type === "video" && <video style={{ width: "100%", aspectRatio: "1/1" }}><source src={post.downloadUrl || `/uploads/${post.src}`} type="video/mp4" style={{ objectFit: "cover", objectPosition: "center" }}></source></video>}
                    </Paper>
                ))}
                {currentPost && <FullContentViewer post={currentPost} onClose={() => setCurrentPost(null)} />}
            </Box>
        </Box>
    )
}
