import { Typography, Box, Paper, Avatar, Button, TextField, Slider } from "@mui/material";
import Image from "next/image";
import { useInView } from "motion/react"
import { useRef, useEffect, useState } from "react";
import { VolumeOff, VolumeUp } from "@mui/icons-material";

const feedContentViewer = ({post}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {amount: 0.5});
    const [isMuted, setIsMuted] = useState("true");
    const [progress, setProgress] = useState(0);
    useEffect(() => {
      // Add null check before accessing ref.current very very important because it will throw error if not checked since ref is null initially
      if (ref.current) {
        isInView ? ref.current.play() : ref.current.pause();
        ref.current.volume = isMuted ? 0 : 1;
        setProgress((ref.current.currentTime / ref.current.duration)*100);
      }
    }, [isInView, isMuted, progress]);
    const handleSeek = (event) => {
      if (ref.current) {
        const newProgress = event.target.value;
        setProgress(newProgress);
        ref.current.currentTime = (newProgress / 100) * ref.current.duration;
      }
    }
    return(
      <>
        {post.type == "video" ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", position: "relative"}}>
          <video id="video" ref={ref} autoPlay loop playsInline preload="auto" style={{objectFit: "cover", objectPosition: "center", maxWidth: "100%", maxHeight: "auto"}} 
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
            <source src={post.src} type="video/mp4"/>
          </video>
          <Button onClick={() => {setIsMuted(!isMuted)}} sx={{ position: "absolute", bottom: 16, right: 16, backgroundColor: "rgba(0, 0, 0, 0.6)", color: "white", "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)", }, zIndex: 1, }}>
            {isMuted ? <VolumeOff/> : <VolumeUp/>}
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
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%"}}>
            <img src={post.src} alt={`Feed image`} style={{objectFit: "contain", objectPosition: "center", maxWidth: "100%", maxHeight: "auto"}} unoptimized/>
          </Box>
        )}
      </>
    );
  }

  export default feedContentViewer;