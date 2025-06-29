const mongoose = require("mongoose");

const commentSubSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, { _id: true });

const postSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
        type: { type: String, enum: ["image", "video"], required: true },
        src: { type: String, required: true },
        caption: { type: String },
        likes: { type: [mongoose.Schema.Types.ObjectId], ref: "Users", default: [] },
        comments: { type: [commentSubSchema], default: [] },
    },
    {
        timestamps: true
    }
)

mongoose.model("Posts", postSchema);