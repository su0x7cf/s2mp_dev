import { Box, Typography, Avatar, Grid, Paper, Card, CardContent, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import FullContentViewer from "./fullContentViewer";
import PhotoCamera from '@mui/icons-material/PhotoCamera';

export default function ProfileComponent() {
    const user = useSelector((state) => state.userState.user);
    const [profileUser, setProfileUser] = useState(user);
    const [posts, setPosts] = useState([]);
    const [followers, setFollowers] = useState([]); // now array
    const [following, setFollowing] = useState([]); // now array
    const [followersOpen, setFollowersOpen] = useState(false);
    const [followingOpen, setFollowingOpen] = useState(false);
    const [fullContentViewer, setFullContentViewer] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [previewUser, setPreviewUser] = useState(null);
    const [previewPosts, setPreviewPosts] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewIsFollowing, setPreviewIsFollowing] = useState(false);
    const [previewFollowLoading, setPreviewFollowLoading] = useState(false);
    const [savedPosts, setSavedPosts] = useState([]);
    const isOwnProfile = user && profileUser && user._id === profileUser._id;
    useEffect(() => {
        // On mount or when mainState/profile navigation happens, check for profileUserId in localStorage
        const storedId = typeof window !== "undefined" ? localStorage.getItem("profileUserId") : null;
        if (storedId && (!profileUser || profileUser._id !== storedId)) {
            // Fetch user info for that id
            axios.post("/api/v1/auth/me", { userId: storedId })
                .then(res => setProfileUser(res.data.user))
                .catch(() => setProfileUser(user));
        } else if (!storedId) {
            setProfileUser(user);
        }
    }, [user]);
    useEffect(() => {
        if (profileUser && profileUser._id) {
            axios.get(`/api/v1/posts/user/${profileUser._id}/full`)
                .then(res => setPosts(res.data.posts))
                .catch(() => setPosts([]));
            axios.get(`/api/v1/users/${profileUser._id}/followers`)
                .then(res => setFollowers(res.data.followers || []))
                .catch(() => setFollowers([]));
            axios.get(`/api/v1/users/${profileUser._id}/following`)
                .then(res => setFollowing(res.data.following || []))
                .catch(() => setFollowing([]));
            axios.get(`/api/v1/users/${profileUser._id}/saved-posts`)
                .then(res => setSavedPosts(res.data.savedPosts || []))
                .catch(() => setSavedPosts([]));
            if (user && profileUser._id !== user._id) {
                axios.get(`/api/v1/users/${profileUser._id}/followers`).then(res => {
                    setIsFollowing(res.data.followers.some(f => f._id === user._id));
                }).catch(() => setIsFollowing(false));
            }
        }
    }, [profileUser, user]);
    const handleAvatarChange = async (e) => {
        if (!e.target.files || !e.target.files[0]) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("avatar", file);
        setAvatarUploading(true);
        try {
            const res = await axios.post(`/api/v1/users/${user._id}/avatar`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setProfileUser(res.data.user);
        } catch { }
        setAvatarUploading(false);
    };
    // Listen for profile preview request
    useEffect(() => {
        const storedId = typeof window !== "undefined" ? localStorage.getItem("profileUserId") : null;
        if (storedId && user && storedId !== user._id) {
            // Fetch user info and posts for preview
            axios.post("/api/v1/auth/me", { userId: storedId })
                .then(res => setPreviewUser(res.data.user))
                .catch(() => setPreviewUser(null));
            axios.get(`/api/v1/posts/user/${storedId}/full`)
                .then(res => setPreviewPosts(res.data.posts))
                .catch(() => setPreviewPosts([]));
            setPreviewOpen(true);
            // Remove so it doesn't keep opening
            localStorage.removeItem("profileUserId");
        } else {
            setPreviewOpen(false);
        }
    }, [user]);
    useEffect(() => {
        if (previewUser && user) {
            setPreviewIsFollowing(previewUser.followers?.some(f => f._id === user._id));
        }
    }, [previewUser, user]);
    const handlePreviewFollow = async () => {
        if (!previewUser || !user) return;
        setPreviewFollowLoading(true);
        if (previewIsFollowing) {
            await axios.post(`/api/v1/users/${previewUser._id}/unfollow`, { userId: user._id });
        } else {
            await axios.post(`/api/v1/users/${previewUser._id}/follow`, { userId: user._id });
        }
        // Refresh preview user
        const res = await axios.post("/api/v1/auth/me", { userId: previewUser._id });
        setPreviewUser(res.data.user);
        setPreviewFollowLoading(false);
    };
    if (!profileUser) return null;
    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", minHeight: "100vh", width: "100%", py: 0 }}>
                {/* Profile Info Section */}
                <Card sx={{ width: 400, mb: 4, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
                        <Box sx={{ position: "relative", mb: 2 }}>
                            <Avatar
                                src={profileUser.avatar ? `/download/${profileUser.avatar}` : undefined}
                                sx={{ width: 80, height: 80, fontSize: 36 }}
                            >
                                {(!profileUser.avatar && profileUser.username?.[0]?.toUpperCase()) || "U"}
                            </Avatar>
                            {isOwnProfile && (
                                <>
                                    <input
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        id="avatar-upload-input"
                                        type="file"
                                        onChange={handleAvatarChange}
                                        disabled={avatarUploading}
                                    />
                                    <label htmlFor="avatar-upload-input">
                                        <Button
                                            component="span"
                                            size="small"
                                            sx={{ position: "absolute", bottom: 0, right: 0, minWidth: 0, p: 1, borderRadius: "50%", bgcolor: "background.paper", boxShadow: 1 }}
                                            disabled={avatarUploading}
                                        >
                                            <PhotoCamera fontSize="small" />
                                        </Button>
                                    </label>
                                </>
                            )}
                        </Box>
                        <Typography variant="h5" align="center">{profileUser.username}</Typography>
                        <Typography variant="body1" color="text.secondary" align="center">{profileUser.email}</Typography>
                        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 2, justifyContent: "center" }}>
                            <Button variant="text" onClick={() => setFollowersOpen(true)}><b>{followers.length}</b> Followers</Button>
                            <Button variant="text" onClick={() => setFollowingOpen(true)}><b>{following.length}</b> Following</Button>
                        </Box>
                        {user && profileUser._id !== user._id && (
                            <Button
                                variant={isFollowing ? "outlined" : "contained"}
                                color={isFollowing ? "secondary" : "primary"}
                                sx={{ mt: 2 }}
                                onClick={async () => {
                                    if (isFollowing) {
                                        await axios.post(`/api/v1/users/${profileUser._id}/unfollow`, { userId: user._id });
                                    } else {
                                        await axios.post(`/api/v1/users/${profileUser._id}/follow`, { userId: user._id });
                                    }
                                    // Refresh followers and following
                                    const [followersRes, followingRes] = await Promise.all([
                                        axios.get(`/api/v1/users/${profileUser._id}/followers`),
                                        axios.get(`/api/v1/users/${profileUser._id}/following`)
                                    ]);
                                    setFollowers(followersRes.data.followers || []);
                                    setFollowing(followingRes.data.following || []);
                                    setIsFollowing(!isFollowing);
                                }}
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </Button>
                        )}
                    </CardContent>
                </Card>
                {/* Followers Dialog */}
                <Dialog open={followersOpen} onClose={() => setFollowersOpen(false)}>
                    <DialogTitle>Followers</DialogTitle>
                    <DialogContent>
                        {followers.length === 0 ? (
                            <Typography>No followers yet.</Typography>
                        ) : (
                            followers.map(f => (
                                <Box key={f._id} sx={{ display: "flex", alignItems: "center", gap: 2, my: 1 }}>
                                    <Avatar sx={{ width: 32, height: 32 }}>{f.username?.[0]?.toUpperCase() || "U"}</Avatar>
                                    <Typography>{f.username}</Typography>
                                    <Typography color="text.secondary">{f.email}</Typography>
                                </Box>
                            ))
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setFollowersOpen(false)}>Close</Button>
                    </DialogActions>
                </Dialog>
                {/* Following Dialog */}
                <Dialog open={followingOpen} onClose={() => setFollowingOpen(false)}>
                    <DialogTitle>Following</DialogTitle>
                    <DialogContent>
                        {following.length === 0 ? (
                            <Typography>Not following anyone yet.</Typography>
                        ) : (
                            following.map(f => (
                                <Box key={f._id} sx={{ display: "flex", alignItems: "center", gap: 2, my: 1 }}>
                                    <Avatar sx={{ width: 32, height: 32 }}>{f.username?.[0]?.toUpperCase() || "U"}</Avatar>
                                    <Typography>{f.username}</Typography>
                                    <Typography color="text.secondary">{f.email}</Typography>
                                </Box>
                            ))
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setFollowingOpen(false)}>Close</Button>
                    </DialogActions>
                </Dialog>
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
                {/* Saved Posts Section */}
                <Card sx={{ width: 700, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", mt: 4 }}>
                    <CardContent sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <Typography variant="h6" sx={{ mb: 2, alignSelf: "center" }}>Saved Posts</Typography>
                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                            {savedPosts.length === 0 && <Typography sx={{ ml: 2 }}>No saved posts yet.</Typography>}
                            {savedPosts.map((post) => (
                                <Grid item xs={6} key={post._id} display="flex" justifyContent="center" alignItems="center">
                                    <Paper sx={{ p: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 200, cursor: "pointer", position: "relative" }}
                                        onClick={() => { setCurrentPost(post); setFullContentViewer(true); }}>
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
                    <FullContentViewer
                        post={{ ...currentPost, src: currentPost?.downloadUrl || `/uploads/${currentPost?.src}` }}
                        onClose={() => setFullContentViewer(false)}
                        onDelete={() => setConfirmOpen(true)}
                        loading={deleteLoading}
                    />
                )}
                {/* Delete confirmation dialog */}
                <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                    <DialogTitle>Delete Post?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this post? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmOpen(false)} disabled={deleteLoading}>Cancel</Button>
                        <Button onClick={async () => {
                            setDeleteLoading(true);
                            // Try delete by _id, then by src if needed
                            let deleted = false;
                            try {
                                await axios.delete(`/api/v1/posts/${currentPost._id}`);
                                deleted = true;
                            } catch { }
                            if (!deleted) {
                                try {
                                    await axios.delete(`/api/v1/posts/by-src/${currentPost.src}`);
                                    deleted = true;
                                } catch { }
                            }
                            if (deleted) {
                                setPosts(posts.filter(p => p._id !== currentPost._id && p.src !== currentPost.src));
                                setFullContentViewer(false);
                                setConfirmOpen(false);
                            }
                            setDeleteLoading(false);
                        }} color="error" disabled={deleteLoading}>
                            {deleteLoading ? <CircularProgress size={20} /> : "Delete"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* Profile Preview Dialog for other users */}
            <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{previewUser?.username || "User"}'s Profile</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Avatar src={previewUser?.avatar ? `/download/${previewUser.avatar}` : undefined} sx={{ width: 80, height: 80, fontSize: 36 }}>
                            {(!previewUser?.avatar && previewUser?.username?.[0]?.toUpperCase()) || "U"}
                        </Avatar>
                        <Typography variant="h5" align="center">{previewUser?.username}</Typography>
                        <Typography variant="body1" color="text.secondary" align="center">{previewUser?.email}</Typography>
                        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 2, justifyContent: "center" }}>
                            <Typography variant="body2"><b>{previewUser?.followers?.length || 0}</b> Followers</Typography>
                            <Typography variant="body2"><b>{previewUser?.following?.length || 0}</b> Following</Typography>
                        </Box>
                        {user && previewUser && user._id !== previewUser._id && (
                            <Button
                                variant={previewIsFollowing ? "outlined" : "contained"}
                                color={previewIsFollowing ? "secondary" : "primary"}
                                sx={{ mt: 2, mb: 1 }}
                                onClick={handlePreviewFollow}
                                disabled={previewFollowLoading}
                            >
                                {previewIsFollowing ? "Unfollow" : "Follow"}
                            </Button>
                        )}
                        <Typography variant="h6" sx={{ mt: 3 }}>Posts</Typography>
                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                            {previewPosts.length === 0 && <Typography sx={{ ml: 2 }}>No posts yet.</Typography>}
                            {previewPosts.map((post) => (
                                <Grid item xs={6} key={post._id} display="flex" justifyContent="center" alignItems="center">
                                    <Paper sx={{ p: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 200, cursor: "pointer", position: "relative" }}>
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
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPreviewOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}