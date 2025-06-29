import { Backdrop, Box, Paper, Typography, IconButton, Divider, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import BookmarksOutlinedIcon from "@mui/icons-material/BookmarksOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function FullContentViewer({ post, onClose, onDelete, loading }) {
    const user = useSelector((state) => state.userState.user);
    const [likeLoading, setLikeLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [localPost, setLocalPost] = useState(post);

    // Like/unlike logic
    const isLiked = user && localPost.likes && localPost.likes.includes(user._id);
    const handleLike = async () => {
        if (!user) return;
        setLikeLoading(true);
        try {
            const res = await axios.post(`/api/v1/posts/${localPost.src}/${isLiked ? "unlike" : "like"}`, { userId: user._id });
            setLocalPost(res.data.post);
        } catch { }
        setLikeLoading(false);
    };

    // Add comment logic
    const handleAddComment = async () => {
        if (!user || !commentText.trim()) return;
        setCommentLoading(true);
        try {
            const res = await axios.post(`/api/v1/posts/${localPost.src}/comment`, { userId: user._id, comment: commentText });
            setLocalPost(res.data.post);
            setCommentText("");
        } catch { }
        setCommentLoading(false);
    };

    // Delete comment logic
    const handleDeleteComment = async (commentId) => {
        if (!user) return;
        setCommentLoading(true);
        try {
            const res = await axios.delete(`/api/v1/posts/${localPost.src}/comment/${commentId}`);
            setLocalPost(res.data.post);
        } catch { }
        setCommentLoading(false);
    };

    if (!localPost) return null;

    return (
        <Backdrop open onClick={onClose} sx={{ zIndex: 1000, backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", maxWidth: "720px", height: "90%", border: "1px solid black", overflowY: "scroll", scrollbarWidth: "none" }}>
                <Paper elevation={3} onClick={(event) => event.stopPropagation()} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", maxHeight: "100%", maxWidth: "100%", px: "10px", py: "10px", mx: "10px", my: "10px", position: "relative" }}>

                    {/* Close button */}
                    <IconButton sx={{ position: "absolute", top: 16, right: 16, zIndex: 10 }} onClick={onClose} disabled={loading}>
                        <CloseIcon />
                    </IconButton>

                    {/* Delete button */}
                    {onDelete && (
                        <IconButton sx={{ position: "absolute", top: 16, left: 16, zIndex: 10, color: "error.main" }} onClick={onDelete} disabled={loading}>
                            {loading ? <span className="spinner-border spinner-border-sm" style={{ width: 20, height: 20 }} /> : <DeleteIcon />}
                        </IconButton>
                    )}

                    {/* Media */}
                    <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        {localPost.type === "image" && (
                            <img src={localPost.src} alt={`Feed image`} style={{ objectFit: "contain", objectPosition: "center", maxWidth: "100%", maxHeight: "auto", aspectRatio: "1/1" }} />
                        )}
                        {localPost.type === "video" && (
                            <video controls autoPlay muted loop playsInline preload="auto" style={{ objectFit: "contain", objectPosition: "center", maxWidth: "100%", maxHeight: "auto", aspectRatio: "1/1" }}>
                                <source src={localPost.src} type="video/mp4" style={{}} />
                            </video>
                        )}
                    </Box>

                    {/* Likes + Comments */}
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "90%", maxWidth: "100%", py: "5px" }}>
                        <IconButton size="small" sx={{ borderRadius: "3px", gap: 1 }} onClick={handleLike} disabled={likeLoading || !user}>
                            <FavoriteBorderIcon color={isLiked ? "error" : undefined} />
                            <Typography variant="body2" sx={{ fontSize: ".8rem" }}>{localPost.likes?.length || 0} likes</Typography>
                        </IconButton>
                        <Box>
                            <IconButton size="small" sx={{ borderRadius: "3px", gap: 1 }}>
                                <ShareOutlinedIcon />
                            </IconButton>
                            <IconButton size="small" sx={{ borderRadius: "3px", gap: 1 }}>
                                <BookmarksOutlinedIcon />
                            </IconButton>
                        </Box>
                    </Box>


                    {/* Caption */}
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "90%", maxWidth: "700px" }}>
                        <Typography variant="body2" textAlign={"justify"} sx={{ mb: 2, color: "hsla(0, 0%, 0%, 0.7)", fontSize: ".8rem" }}>
                            {localPost.caption}
                        </Typography>
                    </Box>

                </Paper>

                {/* Comments Section */}
                <Paper elevation={3} onClick={(event) => event.stopPropagation()} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between", maxWidth: "100%", maxHeight: "100%", mx: "10px" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", maxWidth: "100%", width: "100%" }}>
                        {localPost.comments && localPost.comments.length > 0 ? (
                            localPost.comments.map((c) => (
                                <Box key={c._id} sx={{ width: "100%" }}>
                                    <Typography variant="body1" sx={{ padding: 2, textAlign: "justify", fontSize: "0.8rem" }}>
                                        <strong>{c.userId?.name || c.userId || "User"}</strong> : {c.comment}
                                        {user && (c.userId?._id === user._id || c.userId === user._id) && (
                                            <IconButton size="small" color="error" onClick={() => handleDeleteComment(c._id)} disabled={commentLoading}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2" sx={{ padding: 2, color: "gray" }}>No comments yet.</Typography>
                        )}
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                        <TextField size="small" placeholder="Add a comment..." variant="outlined" fullWidth sx={{ m: 2 }} value={commentText} onChange={e => setCommentText(e.target.value)} disabled={commentLoading} />
                        <IconButton size="large" sx={{ borderRadius: "3px", mr: "15px" }} onClick={handleAddComment} disabled={commentLoading || !commentText.trim()}>
                            <SendOutlinedIcon />
                        </IconButton>
                    </Box>
                </Paper>
            </Box>
        </Backdrop>
    );
}
