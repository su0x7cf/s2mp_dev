import { Box, IconButton, Typography, Button, TextField } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useRef, useEffect } from "react";
//redux components
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

export default function CreateComponent() {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [caption, setCaption] = useState("");
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef();
    const userState = useSelector((state) => state.userState.user);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
    };
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleClose = () => {
        setFile(null);
        setPreviewUrl(null);
    };

    const triggerFileSelect = () => {
        inputRef.current.click();
    };

    const handleUpload = async () => {
        if (!file || !userState || !userState._id) return;
        const formData = new FormData();
        formData.append("media", file); // use 'media' to match backend
        formData.append("type", file.type.startsWith("image") ? "image" : "video");
        formData.append("caption", caption);
        formData.append("userId", userState._id);
        try {
            setUploading(true);
            const res = await axios.post("/api/v1/posts/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            handleClose();
        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setUploading(false);
        }
    };
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", maxWidth: "100%", mt: "20px" }}>
            {uploading && (
                <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", bgcolor: "rgba(255,255,255,0.7)", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Uploading...</Typography>
                </Box>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: !file ? null : "100%", height: !file ? null : "100%" }}>
                {/* File Preview */}
                {previewUrl && (
                    file.type.startsWith("image") ? (
                        <img src={previewUrl} alt="Preview" style={{ objectFit: "contain", objectPosition: "center", width: "90%", maxHeight: "auto", aspectRatio: "1/1", borderRadius: "3px" }} />
                    ) : (
                        <video controls style={{ objectFit: "contain", objectPosition: "center", maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", borderRadius: "10px" }}>
                            <source src={previewUrl} type={file.type} />
                            Your browser does not support the video tag.
                        </video>
                    )
                )}
            </Box>
            <Box sx={{ display: !file ? "flex" : "none", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "640px", height: "550px", position: "relative" }}>
                <Typography variant="h6" sx={{ color: "hsla(0, 0%, 0%, 0.6)" }}>Please select a file to continue</Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "95%", height: "100%", mt: "20px" }}>
                <TextField disabled={!file} placeholder="Add a caption..." multiline fullWidth minRows={2} value={caption} onChange={(e) => setCaption(e.target.value)} />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-around", width: "60%", height: "100%", mt: "20px", mb: "20px" }}>
                {/* Upload Button */}
                <IconButton onClick={triggerFileSelect} disabled={uploading} sx={{ width: "30px", height: "30px", borderRadius: "10%", backgroundColor: "hsla(0, 0%, 0%, 0.3)" }}>
                    <AddIcon sx={{ fontSize: "20px" }} />
                </IconButton>
                <input type="file" accept="image/*,video/*" ref={inputRef} onChange={handleFileChange} style={{ display: "none" }} />
                <IconButton onClick={handleUpload} disabled={!file || uploading} sx={{ width: "30px", height: "30px", borderRadius: "10%", backgroundColor: "hsla(0, 0%, 0%, 0.3)" }}>
                    {uploading ? <CircularProgress size={20} /> : <CheckIcon sx={{ fontSize: "20px" }} />}
                </IconButton>
                <IconButton onClick={handleClose} disabled={!file || uploading} sx={{ width: "30px", height: "30px", borderRadius: "10%", backgroundColor: "hsla(0, 0%, 0%, 0.3)" }}>
                    <CloseIcon sx={{ fontSize: "20px" }} />
                </IconButton>
            </Box>
        </Box>
    )
}
