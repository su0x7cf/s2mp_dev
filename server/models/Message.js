// Message model for direct messages between two users
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
        content: { type: String, required: true },
        read: { type: Boolean, default: false },
        readAt: { type: Date, default: null }, // Timestamp for when the message was read
    },
    { timestamps: true }
);

mongoose.model("Messages", messageSchema);
