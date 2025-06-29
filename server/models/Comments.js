const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        comment: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
        postId: { type: mongoose.Schema.Types.ObjectId, ref: "Posts", required: true },
    },
    {
        timestamps: true
    }
);

mongoose.model("Comments", commentSchema);

