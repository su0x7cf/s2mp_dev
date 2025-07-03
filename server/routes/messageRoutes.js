// Message routes for direct messages between users
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");

module.exports = (app) => {
    const Message = mongoose.model("Messages");
    const User = mongoose.model("Users");

    // Send a message
    app.post("/api/v1/messages/send", requireLogin, async (req, res) => {
        const { recipient, content } = req.body;
        if (!recipient || !content) return res.status(400).json({ error: "Recipient and content required" });
        try {
            const message = await Message.create({ sender: req.user._id, recipient, content });
            res.status(201).json({ message });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Get conversation between two users
    app.get("/api/v1/messages/conversation/:userId", requireLogin, async (req, res) => {
        const otherUserId = req.params.userId;
        try {
            const messages = await Message.find({
                $or: [
                    { sender: req.user._id, recipient: otherUserId },
                    { sender: otherUserId, recipient: req.user._id }
                ]
            }).sort({ createdAt: 1 });
            res.status(200).json({ messages });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // List all conversations for the logged-in user (last message per user)
    app.get("/api/v1/messages/conversations", requireLogin, async (req, res) => {
        try {
            const messages = await Message.find({
                $or: [
                    { sender: req.user._id },
                    { recipient: req.user._id }
                ]
            }).sort({ createdAt: 1 });
            // Group by other user
            const conversations = {};
            messages.forEach(msg => {
                const otherId = String(msg.sender) === String(req.user._id) ? String(msg.recipient) : String(msg.sender);
                conversations[otherId] = msg;
            });
            res.status(200).json({ conversations });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
};
