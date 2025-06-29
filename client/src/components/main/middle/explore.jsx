import { Box, Typography, Paper, Button } from "@mui/material";
import FullContentViewer from "./fullContentViewer";
import Image from "next/image";
import { useState } from "react";

export default function ExploreComponent() {
    const [fullContentViewer, setFullContentViewer] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);

    const posts = [
        { type: "image", src: "/explore/dummy1.jpg" },
        { type: "image", src: "/explore/dummy2.jpg" },
        { type: "image", src: "/explore/dummy3.jpg" },
        { type: "image", src: "/explore/dummy4.jpg" },
        { type: "image", src: "/explore/dummy5.jpg" },
        { type: "image", src: "/explore/dummy6.jpg" },
        { type: "image", src: "/explore/dummy7.gif" },
        { type: "image", src: "/explore/dummy10.webp" },
        { type: "image", src: "/explore/dummy13.jpg" },
        { type: "image", src: "/explore/dummy14.jpg" },
        { type: "image", src: "/explore/dummy15.jpeg" },
        { type: "image", src: "/explore/dummy16.jpeg" },
        { type: "image", src: "/explore/dummy17.jpeg" },
        { type: "image", src: "/explore/dummy18.jpeg" },
        { type: "image", src: "/explore/dummy19.jpeg" },
        { type: "image", src: "/explore/dummy20.jpeg" },
        { type: "image", src: "/explore/dummy21.jpeg" },
        { type: "image", src: "/explore/dummy22.jpeg" },
        { type: "image", src: "/explore/dummy23.jpeg" },
        { type: "image", src: "/explore/dummy24.jpeg" },
        { type: "image", src: "/explore/dummy25.jpeg" },
        { type: "image", src: "/explore/dummy26.jpeg" },
        { type: "image", src: "/explore/dummy27.jpeg" },
        { type: "image", src: "/explore/dummy28.jpeg" },
        { type: "image", src: "/explore/dummy29.jpeg" },
        { type: "image", src: "/explore/dummy30.jpeg" },
        { type: "image", src: "/explore/dummy31.jpeg" },
        { type: "image", src: "/explore/dummy32.jpeg" },
        { type: "image", src: "/explore/dummy33.jpeg" },
        { type: "image", src: "/explore/dummy34.jpeg" },
        { type: "image", src: "/explore/dummy35.jpeg" },
        { type: "image", src: "/explore/dummy36.jpeg" },
        { type: "image", src: "/explore/dummy37.jpeg" },
        { type: "image", src: "/explore/dummy38.jpeg" },
        { type: "image", src: "/explore/dummy39.jpeg" },
        { type: "image", src: "/explore/dummy40.jpeg" },
        { type: "image", src: "/explore/dummy41.jpeg" },
        { type: "image", src: "/explore/dummy42.jpeg" },
        { type: "image", src: "/explore/dummy43.jpeg" },
        { type: "image", src: "/explore/dummy44.jpeg" },
        { type: "image", src: "/explore/dummy45.jpeg" },
        { type: "image", src: "/explore/dummy46.jpeg" },
        { type: "image", src: "/explore/dummy47.jpeg" },
        { type: "image", src: "/explore/dummy48.jpeg" },
        { type: "image", src: "/explore/dummy49.jpeg" },
        { type: "image", src: "/explore/dummy50.jpeg" },
        { type: "image", src: "/explore/dummy51.jpeg" },
        { type: "image", src: "/explore/dummy52.jpeg" },
        { type: "image", src: "/explore/dummy53.jpeg" },
        { type: "image", src: "/explore/dummy54.jpeg" },
        { type: "image", src: "/explore/dummy55.jpeg" },
        { type: "image", src: "/explore/dummy56.jpg" },
        { type: "image", src: "/explore/dummy57.jpg" },
        { type: "video", src: "/explore/dummy1.mp4" },
        { type: "video", src: "/explore/dummy2.mp4" },
        { type: "video", src: "/explore/dummy3.mp4" },
        { type: "video", src: "/explore/dummy4.mp4" },
        { type: "video", src: "/explore/dummy5.mp4" },
        { type: "video", src: "/explore/dummy6.mp4" },
        { type: "video", src: "/explore/dummy7.mp4" },
        { type: "video", src: "/explore/dummy8.mp4" },
    ]

    return (
        <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "center", height: "100%", width: "100%", overflow: "scroll", scrollbarWidth: "none", scrollSnapType: "y mandatory"}}>
            {posts.map((post, index) => (
                <Paper key={index} onClick={() => setCurrentPost(post)} elevation={3} sx={{ display: "flex", width: "30%", height: "100%", my: "4px", mx: "4px", justifyContent: "center", alignItems: "center"}}>
                    {post.type === "image" && <img src={post.src} alt="dummy" unoptimized style={{objectFit: "cover", objectPosition: "center", width: "100%", aspectRatio: "1/1"}}/>}
                    {post.type === "video" && <video style={{ width: "100%", aspectRatio: "1/1"}}><source src={post.src} style={{objectFit: "cover", objectPosition: "center"}}></source></video>}
                </Paper>
            ))}
            {currentPost && <FullContentViewer post={currentPost} onClose={() => setCurrentPost(null)} />}
        </Box>
    )
}
