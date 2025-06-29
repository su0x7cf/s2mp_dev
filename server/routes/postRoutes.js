const mongoose = require("mongoose");
const Post = mongoose.model("Posts");

const axios = require("axios");
const FormData = require("form-data");
const multer = require("multer");


module.exports = (app) => {
    // get all posts
    app.post("/api/v1/posts/upload", async (req, res) => {
        const { type, caption, userId } = req.body;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        try {
            
            
        }
    });
}