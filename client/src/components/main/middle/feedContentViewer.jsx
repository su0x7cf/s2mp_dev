import { Typography, Box, Paper, Avatar, Button, TextField, Slider } from "@mui/material";
import Image from "next/image";
import { useInView } from "motion/react"
import { useRef, useEffect, useState } from "react";
import { VolumeOff, VolumeUp } from "@mui/icons-material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { useSelector } from "react-redux";
import axios from "axios";

const feedContentViewer = ({ post }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });
  const [isMuted, setIsMuted] = useState("true");
  const [progress, setProgress] = useState(0);
  const user = useSelector((state) => state.userState.user);
  const [localPost, setLocalPost] = useState(post);
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const isSaved = user && localPost.savedBy && localPost.savedBy.includes(user._id);

  useEffect(() => {
    // Add null check before accessing ref.current very very important because it will throw error if not checked since ref is null initially
    if (ref.current) {
      isInView ? ref.current.play() : ref.current.pause();
      ref.current.volume = isMuted ? 0 : 1;
      setProgress((ref.current.currentTime / ref.current.duration) * 100);
    }
  }, [isInView, isMuted, progress]);
  const handleSeek = (event) => {
    if (ref.current) {
      const newProgress = event.target.value;
      setProgress(newProgress);
      ref.current.currentTime = (newProgress / 100) * ref.current.duration;
    }
  }

  // Sync localPost with prop changes
  useEffect(() => {
    setLocalPost(post);
  }, [post]);

  // Like/unlike logic
  const isLiked = user && localPost.likes && localPost.likes.includes(user._id);
  const handleLike = async () => {
    if (!user) return;
    setLikeLoading(true);
    try {
      const res = await axios.post(`/api/v1/posts/${localPost.src}/${isLiked ? "unlike" : "like"}`, { userId: user._id });
      setLocalPost(res.data.post); // Use full post object from backend
    } catch { }
    setLikeLoading(false);
  };

  // Add comment logic
  const handleAddComment = async () => {
    if (!user || !commentText.trim()) return;
    setCommentLoading(true);
    try {
      const res = await axios.post(`/api/v1/posts/${localPost.src}/comment`, { userId: user._id, comment: commentText });
      setLocalPost(res.data.post); // Use full post object from backend
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
      setLocalPost(res.data.post); // Use full post object from backend
    } catch { }
    setCommentLoading(false);
  };

  // Save/unsave logic
  const handleSave = async () => {
    if (!user) return;
    setSaveLoading(true);
    try {
      const endpoint = localPost.savedBy && localPost.savedBy.includes(user._id)
        ? `/api/v1/posts/${localPost.src}/unsave`
        : `/api/v1/posts/${localPost.src}/save`;
      const res = await axios.post(endpoint, { userId: user._id });
      // Optionally update localPost.savedBy if you fetch it in post object
      setLocalPost({ ...localPost, savedBy: res.data.user.savedPosts.map(p => p.toString()) });
    } catch { }
    setSaveLoading(false);
  };

  // Share logic (copy link)
  const handleShare = () => {
    const url = window.location.origin + '/post/' + localPost.src;
    navigator.clipboard.writeText(url);
    alert('Post link copied to clipboard!');
  };

  return (
    <Box sx={{ width: "100%" }}>
      {post.type == "video" ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", position: "relative" }}>
          <video id="video" ref={ref} autoPlay loop playsInline preload="auto" style={{ objectFit: "cover", objectPosition: "center", maxWidth: "100%", maxHeight: "auto" }}
            onClick={() => {
              // Add null check before accessing ref.current
              if (ref.current) {
                (ref.current.paused) ? ref.current.play() : ref.current.pause();
              }
            }} onMouseEnter={() => {
              // Add null check before accessing ref.current
              if (ref.current) {
                ref.current.style.cursor = "pointer";
              }
            }}>
            <source src={post.src} type="video/mp4" />
          </video>
          <Button onClick={() => { setIsMuted(!isMuted) }} sx={{ position: "absolute", bottom: 16, right: 16, backgroundColor: "rgba(0, 0, 0, 0.6)", color: "white", "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)", }, zIndex: 1, }}>
            {isMuted ? <VolumeOff /> : <VolumeUp />}
          </Button>
          <Slider
            value={progress}
            onChange={(event) => {
              handleSeek(event);
            }}
            size="small"
            sx={{
              position: "absolute",
              bottom: -13,
              left: 0,
              right: 0,
              color: "white",
              height: 8,
              borderRadius: "0px",
              "& .MuiSlider-rail": {
                opacity: 1,
                backgroundColor: "hsl(0, 0%, 0%, 0.3)",
                "&:hover": {
                  backgroundColor: "hsl(0, 0%, 40%, 0.3)"
                },
                "&:active": {
                  backgroundColor: "hsl(0, 0%, 40%, 0.3)"
                },
                "&:focus": {
                  backgroundColor: "hsl(0, 0%, 40%, 0.3)"
                },
                "&:focus-visible": {
                  backgroundColor: "hsl(0, 0%, 40%, 0.3)"
                }
              },
              "& .MuiSlider-thumb": {
                display: "none",
                backgroundColor: "hsl(0, 0%, 0%, 0.8)",
                "&:hover": {
                  backgroundColor: "hsl(0, 0%, 40%, 0.8)"
                },
                "&:active": {
                  backgroundColor: "hsl(0, 0%, 40%, 0.8)"
                },
                "&:focus": {
                  backgroundColor: "hsl(0, 0%, 40%, 0.8)"
                },
                "&:focus-visible": {
                  backgroundColor: "hsl(0, 0%, 40%, 0.8)"
                }
              },
              "& .MuiSlider-track": {
                backgroundColor: "hsl(0, 0%, 0%, 0.8)",
                "&:hover": {
                  backgroundColor: "hsl(0, 73%, 62%, 0.8)"
                },
                "&:active": {
                  backgroundColor: "hsl(0, 73%, 62%, 0.8)"
                },
                "&:focus": {
                  backgroundColor: "hsl(0, 73%, 62%, 0.8)"
                },
                "&:focus-visible": {
                  backgroundColor: "hsl(0, 73%, 62%, 0.8)"
                }
              }
            }}
          />
        </Box>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
          <img src={post.src} alt={`Feed image`} style={{ objectFit: "contain", objectPosition: "center", maxWidth: "100%", maxHeight: "auto" }} unoptimized />
        </Box>
      )}
      {/* Like, comment, share, bookmark row */}
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", mt: 1 }}>
        <Box>
          <IconButton size="small" sx={{ borderRadius: "3px", gap: 1 }} onClick={handleLike} disabled={likeLoading || !user}>
            <FavoriteBorderIcon color={isLiked ? "error" : undefined} />
            <Typography variant="body2" sx={{ fontSize: ".8rem" }}>{localPost.likes?.length || 0}</Typography>
          </IconButton>
          <IconButton size="small" sx={{ borderRadius: "3px", gap: 1 }} onClick={() => setShowComments(!showComments)}>
            <ChatBubbleOutlineOutlinedIcon />
            <Typography variant="body2" sx={{ fontSize: ".8rem" }}>{localPost.comments?.length || 0}</Typography>
          </IconButton>
        </Box>
        <Box>
          <IconButton size="small" sx={{ borderRadius: "3px", gap: 1 }} onClick={handleShare}>
            <ShareOutlinedIcon />
          </IconButton>
          <IconButton size="small" sx={{ borderRadius: "3px", gap: 1 }} onClick={handleSave} disabled={saveLoading || !user}>
            <BookmarksOutlinedIcon color={isSaved ? "primary" : undefined} />
          </IconButton>
        </Box>
      </Box>
      {/* Comments section (toggle) */}
      {showComments && (
        <Paper elevation={3} sx={{ mt: 1, p: 1, width: "100%", maxHeight: 200, overflowY: "auto" }}>
          {localPost.comments && localPost.comments.length > 0 ? (
            localPost.comments.map((c) => (
              <Box key={c._id} sx={{ width: "100%" }}>
                <Typography variant="body2" sx={{ padding: 1 }}>
                  <strong>{c.userId?.username || c.userId || "User"}</strong>: {c.comment}
                  {user && (c.userId?._id === user._id || c.userId === user._id) && (
                    <IconButton size="small" color="error" onClick={() => handleDeleteComment(c._id)} disabled={commentLoading}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Typography>
                <Divider sx={{ my: 1 }} />
              </Box>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: "gray" }}>No comments yet.</Typography>
          )}
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", mt: 1 }}>
            <TextField size="small" placeholder="Add a comment..." variant="outlined" fullWidth value={commentText} onChange={e => setCommentText(e.target.value)} disabled={commentLoading} />
            <IconButton size="large" sx={{ borderRadius: "3px", ml: 1 }} onClick={handleAddComment} disabled={commentLoading || !commentText.trim()}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </Box>
  );
}

export default feedContentViewer;