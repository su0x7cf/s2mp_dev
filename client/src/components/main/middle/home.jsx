//mui components
import { Typography, Box, Paper, Avatar, Button, IconButton, Divider, TextField } from "@mui/material";
import axios from "axios";

import { useRef, useEffect, useState } from "react";

import FeedContentViewer from "./feedContentViewer";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { AnimatePresence, motion } from "motion/react";
import SendIcon from '@mui/icons-material/Send';
export default function HomeComponent() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentOpenIndex, setCommentOpenIndex] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    axios.get("/api/v1/posts/all")
      .then(res => {
        // Sort posts by createdAt descending (newest first)
        setPosts((res.data.posts || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.webkitLineClamp = expanded ? "none" : "1";
    }
  }, [expanded]);

  if (loading) {
    return <Typography sx={{ mt: 4, textAlign: "center" }}>Loading posts...</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", width: "100%", overflow: "scroll", scrollbarWidth: "none", scrollSnapType: "y mandatory" }}>
      {posts.map((post, index) => (
        <Paper key={post._id || index} elevation={3} sx={{ position: "relative", width: "95%", maxWidth: "600px", height: "100%", backgroundColor: "white", scrollSnapAlign: "start", marginY: "5px" }}>
          {/* Header */}
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginX: "5px", marginY: "3px" }}>
            <Button sx={{ color: "hsl(0, 0%, 0%, 0.8)", gap: "10px" }}>
              <Avatar src={post.userId?.avatar ? `/download/${post.userId.avatar}` : undefined} sx={{ width: "25px", height: "25px", backgroundColor: "black" }}>
                {(!post.userId?.avatar && post.userId?.username?.[0]?.toUpperCase()) || "U"}
              </Avatar>
              <Typography variant="body3" sx={{ fontSize: 'clamp(0.7rem, 1vw, 0.8rem)', textTransform: "none" }}>{post.userId?.username || "User"}</Typography>
            </Button>
            <Button variant="text" sx={{ color: "hsl(0, 0%, 0%, 0.7)", fontSize: 'clamp(0.7rem, 1vw, 0.8rem)', textTransform: "none" }}>Follow or Request</Button>
          </Box>
          {/* Content */}
          <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FeedContentViewer post={{
              ...post,
              src: post.downloadUrl || `/uploads/${post.src}`,
              // Pass caption explicitly for FeedContentViewer
              caption: post.caption
            }} />
          </Box>
          {/* Interaction Buttons*/}
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginX: "5px", mt: "5px" }}>
            {/* Remove dummy buttons, keep only FeedContentViewer's interactive row */}
          </Box>
          {/* Caption */}
          <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "start", justifyContent: "start", marginX: "15px", mb: "15px", backgroundColor: "white" }}>
            <Typography ref={ref} variant="body1" sx={{ display: "-webkit-box", WebkitLineClamp: expanded ? "none" : "1", WebkitBoxOrient: "vertical", overflow: "hidden", width: "100%", textAlign: "justify", fontSize: 'clamp(0.7rem, 1vw, .8rem)' }}>
              {post.caption || ""}
            </Typography>
            {post.caption && post.caption.length > 60 && (
              <Typography variant="body1" fontSize={"clamp(0.7rem, 1svw, .8rem)"} onClick={() => { setExpanded(!expanded) }} sx={{ color: "hsl(0, 0%, 0%, 0.8)", cursor: "pointer", "&:hover": { color: "hsl(0, 0%, 0%, 0.6)", "&:active": { color: "hsl(0, 0%, 0%, 0.4)" } } }}>{expanded ? "less" : "more"}</Typography>
            )}
          </Box>
          {/* Comments */}
          <AnimatePresence>
            {commentOpenIndex === index && (
              <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: "0.3" }} style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "100%", zIndex: 5, }}>
                <Paper elevation={3} sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, pt: 1, width: "90%" }}>
                    <Typography variant="subtitle2">Comments</Typography>
                    <IconButton onClick={() => setCommentOpenIndex(null)} size="small">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Paper elevation={3} sx={{ flexGrow: 1, overflowY: "scroll", scrollbarWidth: "none", mx: "5px", my: "0px", py: "10px", px: "10px", width: "90%" }}>
                    <Typography variant="body2"><strong>Alice:</strong> Love it 🔥</Typography>
                    <Divider sx={{ my: "10px" }} />
                    <Typography variant="body2"><strong>Bob:</strong> Wow.</Typography>
                  </Paper>
                  <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", mx: "5px", mt: "10px", mb: "10px", width: "90%" }}>
                    <TextField fullWidth size="small" variant="outlined" placeholder="Add a comment..." />
                    <IconButton size="small" sx={{ color: "hsl(0, 0%, 0%, 0.8)", borderRadius: "3px" }}>
                      <SendIcon />
                    </IconButton>
                  </Box>
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>

        </Paper>
      ))}
    </Box>
  );
}