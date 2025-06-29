import { Backdrop, Box, Paper, Typography, IconButton, Divider, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import BookmarksOutlinedIcon from "@mui/icons-material/BookmarksOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import Image from "next/image";

export default function FullContentViewer({ post, onClose }) {
    if (!post) return null;

    return (
        <Backdrop open onClick={onClose} sx={{ zIndex: 1000, backgroundColor: "rgba(0, 0, 0, 0.8)"}}>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", maxWidth: "720px", height: "90%", border: "1px solid black", overflowY: "scroll", scrollbarWidth: "none"}}>
                <Paper elevation={3} onClick={(event) => event.stopPropagation()} sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", maxHeight: "100%", maxWidth: "100%", px: "10px", py: "10px", mx: "10px", my: "10px", position: "relative"}}>
                    
                    {/* Close button */}
                    <IconButton sx={{ position: "absolute", top: 16, right: 16, zIndex: 10 }} onClick={onClose}>
                        <CloseIcon />
                    </IconButton>

                    {/* Media */}
                    <Box sx={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        {post.type === "image" && (
                             <img src={post.src} alt={`Feed image`} style={{objectFit: "contain", objectPosition: "center", maxWidth: "100%", maxHeight: "auto", aspectRatio: "1/1"}} />
                        )}
                        {post.type === "video" && (
                            <video controls autoPlay muted loop playsInline preload="auto" style={{objectFit: "contain", objectPosition: "center", maxWidth: "100%", maxHeight: "auto", aspectRatio: "1/1"}}>
                                <source src={post.src} type="video/mp4" style={{}}/>
                            </video>
                        )}
                    </Box>

                    {/* Likes + Comments */}
                    <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "90%", maxWidth: "100%", py: "5px"}}>
                        <IconButton size="small" sx={{borderRadius: "3px", gap: 1}}>
                            <FavoriteBorderIcon/>
                            <Typography variant="body2" sx={{fontSize: ".8rem"}}>42 likes</Typography>
                        </IconButton>
                        <Box>   
                            <IconButton size="small" sx={{borderRadius: "3px", gap: 1}}>
                                <ShareOutlinedIcon/>
                            </IconButton>
                            <IconButton size="small" sx={{borderRadius: "3px", gap: 1}}>
                                <BookmarksOutlinedIcon/>
                            </IconButton>
                        </Box>
                    </Box>

                    
                    {/* Caption */}
                    <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "90%", maxWidth: "700px"}}>
                        <Typography variant="body2" textAlign={"justify"} sx={{ mb: 2, color: "hsla(0, 0%, 0%, 0.7)", fontSize: ".8rem"}}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at malesuada ipsum. Ut condimentum, arcu quis accumsan posuere, dolor mi placerat magna, fermentum fringilla ante lectus sed leo. Vivamus convallis sollicitudin ante ac rutrum. Nunc pellentesque est erat, eleifend faucibus metus rutrum eget. Integer semper orci quis tempor porttitor. Aenean blandit felis eu urna commodo ornare. Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi id nisi sagittis, bibendum nisl suscipit, porta ex. Ut mollis tristique diam sed congue. Maecenas non porta sapien. Praesent lobortis, neque quis vulputate sodales, nisl est lobortis elit, a placerat tellus risus sit amet risus. Nulla at tortor sodales dui rutrum feugiat. Cras ultricies nec elit eget semper. Vivamus venenatis viverra cursus. Nullam hendrerit sem nec nunc dictum hendrerit. Nullam condimentum turpis eget urna cursus gravida.
                        </Typography>
                    </Box>

                </Paper>

                <Paper elevation={3} onClick={(event) => event.stopPropagation()} sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between", maxWidth: "100%", maxHeight: "100%", mx: "10px"}}>
                    <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", maxWidth: "100%"}}>
                            <Typography variant="body1" sx={{ padding: 2, textAlign: "justify", fontSize: "0.8rem" }}>
                                <strong>User1</strong> : Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at malesuada ipsum. Ut condimentum, arcu quis accumsan posuere, dolor mi placerat magna, fermentum fringilla ante lectus sed leo.
                                <Divider sx={{my: 2}}/>
                                <strong>User2</strong> : Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at malesuada ipsum. Ut condimentum, arcu quis accumsan posuere, dolor mi placerat magna, fermentum fringilla ante lectus sed leo.
                                <Divider sx={{my: 2}}/>
                                <strong>User3</strong> : Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at malesuada ipsum. Ut condimentum, arcu quis accumsan posuere, dolor mi placerat magna, fermentum fringilla ante lectus sed leo.
                            </Typography>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                        <TextField size="small" placeholder="Add a comment..." variant="outlined" fullWidth sx={{m: 2}}/>
                        <IconButton size="large" sx={{borderRadius: "3px", mr: "15px"}}>
                            <SendOutlinedIcon/>
                        </IconButton>
                    </Box>
                </Paper>
            </Box>
        </Backdrop>
    );
}
