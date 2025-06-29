import { Box, Typography, Avatar, Grid, Paper, Card, CardContent } from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import FullContentViewer from "./fullContentViewer";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ProfileComponent() {
    const user = useSelector((state) => state.userState.user);
    const [posts, setPosts] = useState([]);
    // Placeholder for followers/following
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [fullContentViewer, setFullContentViewer] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    useEffect(() => {
        if (user && user._id) {
            axios.get(`/api/v1/posts/user/${user._id}/full`)
                .then(res => setPosts(res.data.posts))
                .catch(() => setPosts([]));
            // TODO: Replace with real API calls for followers/following
            setFollowers(0);
            setFollowing(0);
        }
    }, [user]);
    if (!user) return null;
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", minHeight: "100vh", width: "100%", py: 0 }}>
            {/* Profile Info Section */}
            <Card sx={{ width: 400, mb: 4, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
                    <Avatar sx={{ width: 80, height: 80, mb: 2 }}>{user.name?.[0]?.toUpperCase() || "U"}</Avatar>
                    <Typography variant="h5" align="center">{user.name}</Typography>
                    <Typography variant="body1" color="text.secondary" align="center">{user.email}</Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 2, justifyContent: "center" }}>
                        <Typography variant="body2"><b>{followers}</b> Followers</Typography>
                        <Typography variant="body2"><b>{following}</b> Following</Typography>
                    </Box>
                </CardContent>
            </Card>
            {/* Posts Section */}
            <Card sx={{ width: 700, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <CardContent sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="h6" sx={{ mb: 2, alignSelf: "center" }}>Your Posts</Typography>
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        {posts.length === 0 && <Typography sx={{ ml: 2 }}>No posts yet.</Typography>}
                        {posts.map((post) => (
                            <Grid item xs={6} key={post._id} display="flex" justifyContent="center" alignItems="center">
                                <Paper sx={{ p: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 200, cursor: "pointer", position: "relative" }}
                                    onClick={() => { setCurrentPost(post); setFullContentViewer(true); }}>
                                    <IconButton size="small" sx={{ position: "absolute", top: 4, right: 4, zIndex: 2 }}
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            if (window.confirm("Are you sure you want to delete this post?")) {
                                                try {
                                                    await axios.delete(`/api/v1/posts/${post._id}`);
                                                    setPosts(posts.filter(p => p._id !== post._id));
                                                } catch (err) {
                                                    alert("Failed to delete post");
                                                }
                                            }
                                        }}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                    {post.type === "image" ? (
                                        <img src={post.downloadUrl || `/uploads/${post.src}`} alt={post.caption} style={{ width: "100%", maxHeight: 200, objectFit: "cover" }} />
                                    ) : (
                                        <video controls style={{ width: "100%", maxHeight: 200 }}>
                                            <source src={post.downloadUrl || `/uploads/${post.src}`} type="video/mp4" />
                                        </video>
                                    )}
                                    <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>{post.caption}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>
            {fullContentViewer && (
                <FullContentViewer post={{ ...currentPost, src: currentPost?.downloadUrl || `/uploads/${currentPost?.src}` }} onClose={() => setFullContentViewer(false)} />
            )}
        </Box>
    );
}