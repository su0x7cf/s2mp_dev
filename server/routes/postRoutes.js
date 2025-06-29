const mongoose = require("mongoose");
const Post = mongoose.model("Posts");

const axios = require("axios");
const FormData = require("form-data");
const multer = require("multer");
const fs = require("fs");

module.exports = (app) => {
    // create post with media upload
    app.post("/api/v1/posts/upload", multer({ dest: "uploads/" }).single("media"), async (req, res) => {
        const { type, caption, userId } = req.body;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        try {
            // Forward file to object server
            const formData = new FormData();
            formData.append("media", fs.createReadStream(file.path), file.originalname);
            // Optionally, you can add more fields if needed
            const objectRes = await axios.post(
                "http://localhost:5001/upload",
                formData,
                { headers: formData.getHeaders() }
            );
            // Save post in DB with reference to file and caption
            const post = await Post.create({
                userId,
                type,
                src: objectRes.data.file.filename, // reference from object server
                caption
            });
            return res.status(201).json({ message: "Post created", post });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    });

    // fetch all post by userId
    app.get("/api/v1/posts/user/:userId", async (req, res) => {
        try {
            const posts = await Post.find({ userId: req.params.userId }).sort({ createdAt: -1 });
            res.status(200).json({ posts });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // fetch all post by userId, with object server file download links
    app.get("/api/v1/posts/user/:userId/full", async (req, res) => {
        try {
            const posts = await Post.find({ userId: req.params.userId }).sort({ createdAt: -1 });
            // Attach download URL for each post
            const postsWithDownload = posts.map(post => ({
                ...post.toObject(),
                downloadUrl: `http://localhost:5001/download/${post.src}`
            }));
            res.status(200).json({ posts: postsWithDownload });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}