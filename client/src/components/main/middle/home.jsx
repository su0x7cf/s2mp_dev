//mui components
import { Typography, Box, Paper, Avatar, Button, IconButton, Divider, TextField} from "@mui/material";

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

  const posts = [
    { type: "image", src: "/dummyImage/dummy1.jpg" },
    { type: "image", src: "/dummyImage/dummy2.jpg" },
    { type: "image", src: "/dummyImage/dummy3.jpg" },
    { type: "image", src: "/dummyImage/dummy4.jpg" },
    { type: "image", src: "/dummyImage/dummy5.jpg" },
    { type: "image", src: "/dummyImage/dummy6.jpg" },
    { type: "image", src: "/dummyImage/dummy7.gif" },
    { type: "image", src: "/dummyImage/dummy10.webp" },
    { type: "image", src: "/dummyImage/dummy13.jpg" },
    { type: "image", src: "/dummyImage/dummy14.jpg" },
    { type: "video", src: "/dummyVideo/dummy1.mp4" },
    { type: "video", src: "/dummyVideo/dummy2.mp4" },
    { type: "video", src: "/dummyVideo/dummy3.mp4" },
    { type: "video", src: "/dummyVideo/dummy4.mp4" },
    { type: "video", src: "/dummyVideo/dummy5.mp4" },
    { type: "video", src: "/dummyVideo/dummy6.mp4" },
    { type: "video", src: "/dummyVideo/dummy7.mp4" },
    { type: "video", src: "/dummyVideo/dummy8.mp4" }
  ];

  const ref = useRef(null);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.webkitLineClamp = expanded ? "none" : "1";
    }
  }, [expanded]);

  const [commentOpenIndex, setCommentOpenIndex] = useState(null);

  return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", width: "100%", overflow: "scroll", scrollbarWidth: "none", scrollSnapType: "y mandatory"}}>
        
          {posts.map((post,index) => (<>
          <Paper key={index} elevation={3} sx={{ position: "relative", width: "95%", maxWidth: "600px", height: "100%", backgroundColor: "white", scrollSnapAlign: "start", marginY: "5px"}}>
            {/* Header */}
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginX: "5px", marginY: "3px"}}>
              <Button sx={{color: "hsl(0, 0%, 0%, 0.8)", gap: "10px"}}>
                <Avatar sx={{ width: "25px", height: "25px", backgroundColor: "black" }}></Avatar>
                <Typography variant="body3" sx={{ fontSize: 'clamp(0.7rem, 1vw, 0.8rem)', textTransform: "none"}}>Avatar Name</Typography>
              </Button>
              <Button variant="text" sx={{color: "hsl(0, 0%, 0%, 0.7)", fontSize: 'clamp(0.7rem, 1vw, 0.8rem)', textTransform: "none"}}>Follow or Request</Button>
            </Box>
            {/* Content */} 
            <Box sx={{width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
              <FeedContentViewer post={post}/>
            </Box>
            {/* Interaction Buttons*/}
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginX: "5px", mt: "5px"}}>
              <Box>
              <IconButton sx={{borderRadius: "3px"}}>
                <FavoriteBorderIcon sx={{ width: "20px", height: "20px"}}/>
                <Typography variant="body1" sx={{ fontSize: "10px" }}>13</Typography>
              </IconButton>
              <IconButton sx={{borderRadius: "3px"}} onClick={() => {setCommentOpenIndex(index)}}>
                <ChatBubbleOutlineOutlinedIcon sx={{ width: "20px", height: "20px"}}/>
                <Typography variant="body1" sx={{ fontSize: "10px" }}>13</Typography>
              </IconButton>
              </Box>
              <Box>
              <IconButton sx={{borderRadius: "3px"}}>
                <ShareOutlinedIcon sx={{ width: "20px", height: "20px"}}/>
              </IconButton>
              <IconButton sx={{borderRadius: "3px"}}>
                <BookmarksOutlinedIcon sx={{ width: "20px", height: "20px"}}/>
              </IconButton>
              </Box>
            </Box>
            {/* Caption */}
            <Box sx={{display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "start", justifyContent: "start", marginX: "15px", mb: "15px", backgroundColor: "white"}}>
              <Typography ref={ref} variant="body1" sx={{display: "-webkit-box", WebkitLineClamp: expanded? "none": "1", WebkitBoxOrient: "vertical", overflow: "hidden", width: "100%", textAlign: "justify", fontSize: 'clamp(0.7rem, 1vw, .8rem)'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin vel odio imperdiet mauris venenatis tempor sed in nisi. Cras a aliquet nisi, vel cursus dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</Typography>
              <Typography variant="body1" fontSize={"clamp(0.7rem, 1svw, .8rem)"} onClick={() => {setExpanded(!expanded)}} sx={{color: "hsl(0, 0%, 0%, 0.8)", cursor: "pointer", "&:hover": {color: "hsl(0, 0%, 0%, 0.6)", "&:active": {color: "hsl(0, 0%, 0%, 0.4)"}}}}>{expanded? "less" : "more"}</Typography>
            </Box>
            {/* Comments */}
            <AnimatePresence>
            {commentOpenIndex === index && (
              <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: "0.3" }} style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "100%", zIndex: 5, }}>
                <Paper elevation={3} sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, pt: 1, width: "90%"}}>
                    <Typography variant="subtitle2">Comments</Typography>
                    <IconButton onClick={() => setCommentOpenIndex(null)} size="small">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Paper elevation={3} sx={{ flexGrow: 1, overflowY: "scroll", scrollbarWidth: "none", mx: "5px", my: "0px", py: "10px", px: "10px", width: "90%" }}>
                    <Typography variant="body2"><strong>Alice:</strong> Love it 🔥</Typography>
                    <Divider sx={{my: "10px"}}/>
                    <Typography variant="body2"><strong>Bob:</strong> Wow.</Typography>
                  </Paper>
                  <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", mx: "5px", mt: "10px", mb: "10px", width: "90%"}}>
                    <TextField fullWidth size="small" variant="outlined" placeholder="Add a comment..." />
                    <IconButton size="small" sx={{color: "hsl(0, 0%, 0%, 0.8)", borderRadius: "3px"}}>
                      <SendIcon/>
                    </IconButton>
                  </Box>
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>

          </Paper>
          </>))}


      </Box>
      );
}