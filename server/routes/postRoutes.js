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

    // fetch all global posts, newest first
    app.get("/api/v1/posts/all", async (req, res) => {
        try {
            const posts = await Post.find({}).sort({ createdAt: -1 }).populate("userId", "username avatar");
            // Attach download URL for each post
            const postsWithDownload = posts.map(post => ({
                ...post.toObject(),
                downloadUrl: post.src ? `http://localhost:5001/download/${post.src}` : undefined
            }));
            res.status(200).json({ posts: postsWithDownload });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // DELETE a post, its media, and all embedded comments (by src)
    app.delete("/api/v1/posts/by-src/:src", async (req, res) => {
        const src = req.params.src;
        try {
            // Find the post by src
            const post = await Post.findOne({ src });
            if (!post) {
                console.error("[DELETE] Post not found by src:", src);
                return res.status(404).json({ error: "Post not found" });
            }
            console.log("[DELETE] Found post by src:", post._id, post.src);

            // Remove media from object server
            if (post.src) {
                try {
                    await axios.delete(`http://localhost:5001/delete/${post.src}`);
                    console.log("[DELETE] Media deleted from object server:", post.src);
                } catch (err) {
                    console.error("[DELETE] Failed to delete media from object server:", err.message);
                }
            }

            // No need to delete comments separately; they are embedded

            // Remove the post itself and check result
            const deleted = await Post.findOneAndDelete({ src });
            if (!deleted) {
                console.error("[DELETE] Failed to delete post from database by src:", src);
                return res.status(500).json({ error: "Failed to delete post from database." });
            }
            console.log("[DELETE] Post deleted from database by src:", deleted._id);

            res.status(200).json({ message: "Post and related data deleted" });
        } catch (err) {
            console.error("[DELETE] Error:", err);
            res.status(500).json({ error: err.message });
        }
    });

    // Like a post (by src)
    app.post("/api/v1/posts/:src/like", async (req, res) => {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: "userId required" });
        try {
            const post = await Post.findOneAndUpdate(
                { src: req.params.src },
                { $addToSet: { likes: userId } },
                { new: true }
            ).populate("likes", "username avatar").populate("comments.userId", "username avatar");
            if (!post) return res.status(404).json({ error: "Post not found" });
            res.status(200).json({ post });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Unlike a post (by src)
    app.post("/api/v1/posts/:src/unlike", async (req, res) => {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: "userId required" });
        try {
            const post = await Post.findOneAndUpdate(
                { src: req.params.src },
                { $pull: { likes: userId } },
                { new: true }
            ).populate("likes", "username avatar").populate("comments.userId", "username avatar");
            if (!post) return res.status(404).json({ error: "Post not found" });
            res.status(200).json({ post });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Add a comment to a post (by src)
    app.post("/api/v1/posts/:src/comment", async (req, res) => {
        const { userId, comment } = req.body;
        if (!userId || !comment) return res.status(400).json({ error: "userId and comment required" });
        try {
            const post = await Post.findOneAndUpdate(
                { src: req.params.src },
                { $push: { comments: { userId, comment, createdAt: new Date() } } },
                { new: true }
            ).populate("comments.userId", "username avatar").populate("likes", "username avatar");
            if (!post) return res.status(404).json({ error: "Post not found" });
            res.status(200).json({ post });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Delete a comment from a post (by src and comment _id)
    app.delete("/api/v1/posts/:src/comment/:commentId", async (req, res) => {
        try {
            const post = await Post.findOneAndUpdate(
                { src: req.params.src },
                { $pull: { comments: { _id: req.params.commentId } } },
                { new: true }
            ).populate("comments.userId", "username avatar").populate("likes", "username avatar");
            if (!post) return res.status(404).json({ error: "Post not found" });
            res.status(200).json({ post });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}