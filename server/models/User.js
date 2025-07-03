const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: { type: String },
        email: { type: String },
        password: { type: String },
        phone: { type: String },
        twoFactorEnabled: { type: Boolean, default: false },
        lastLogin: { type: Date, default: Date.now },
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
        avatar: { type: String },
        savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Posts" }],
    },
    {
        timestamps: true
    }
)

mongoose.model("Users", userSchema);