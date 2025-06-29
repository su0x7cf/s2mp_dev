const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
        type: { type: String, enum: ["image", "video"], required: true },
        src: { type: String, required: true },
        caption: { type: String },
        likes: { type: [mongoose.Schema.Types.ObjectId], ref: "Users", default: [] },
        comments: { type: [mongoose.Schema.Types.ObjectId], ref: "Comments", default: [] },
    },
    {
        timestamps: true
    }
)

mongoose.model("Posts", postSchema);