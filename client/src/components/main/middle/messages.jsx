import { Box, Typography, Paper } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { TextField, Button, List, ListItem, ListItemText, Divider, Avatar } from "@mui/material";

export default function MessagesComponent() {
    const user = useSelector((state) => state.userState.user);
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [mutuals, setMutuals] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!user) return;
        // Fetch followers and following, then compute mutuals
        Promise.all([
            axios.get(`/api/v1/users/${user._id}/followers`),
            axios.get(`/api/v1/users/${user._id}/following`)
        ]).then(([followersRes, followingRes]) => {
            const followers = followersRes.data.followers || [];
            const following = followingRes.data.following || [];
            // Mutuals: users who are both in followers and following
            const mutualIds = new Set(followers.map(f => f._id));
            const mutualUsers = following.filter(f => mutualIds.has(f._id));
            setMutuals(mutualUsers);
        }).catch(() => setMutuals([]));
    }, [user]);

    useEffect(() => {
        if (!user || !selectedUser) return;
        axios.get(`/api/v1/messages/conversation/${selectedUser._id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
            .then(res => setMessages(res.data.messages))
            .catch(() => setMessages([]));
    }, [user, selectedUser]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!messageText.trim() || !selectedUser) return;
        await axios.post("/api/v1/messages/send", {
            recipient: selectedUser._id,
            content: messageText
        }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        setMessageText("");
        // Refresh messages
        const res = await axios.get(`/api/v1/messages/conversation/${selectedUser._id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        setMessages(res.data.messages);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "start", justifyContent: "center", height: "100%", width: "100%" }}>
            {/* Conversation list */}
            <Paper sx={{ width: 220, minWidth: 180, maxWidth: 250, height: "90vh", overflowY: "auto", mr: 2, p: 1 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Chats</Typography>
                <List>
                    {mutuals.length === 0 && <ListItem><ListItemText primary="No mutuals to chat" /></ListItem>}
                    {mutuals.map(otherUser => (
                        <ListItem button key={otherUser._id} selected={selectedUser && selectedUser._id === otherUser._id} onClick={() => setSelectedUser(otherUser)}>
                            <Avatar sx={{ mr: 1 }}>{otherUser.username?.[0]?.toUpperCase() || "U"}</Avatar>
                            <ListItemText primary={otherUser.username} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
            {/* Message area */}
            <Paper sx={{ flex: 1, height: "90vh", display: "flex", flexDirection: "column", p: 2 }}>
                {selectedUser ? (
                    <>
                        <Typography variant="h6" sx={{ mb: 1 }}>{selectedUser.username}</Typography>
                        <Divider sx={{ mb: 1 }} />
                        <Box sx={{ flex: 1, overflowY: "auto", mb: 1 }}>
                            {messages.map(msg => (
                                <Box key={msg._id} sx={{ display: "flex", flexDirection: msg.sender === user._id ? "row-reverse" : "row", alignItems: "center", mb: 1 }}>
                                    <Avatar sx={{ mx: 1 }}>{msg.sender === user._id ? user.username?.[0]?.toUpperCase() : selectedUser.username?.[0]?.toUpperCase()}</Avatar>
                                    <Paper sx={{ p: 1, bgcolor: msg.sender === user._id ? "primary.light" : "grey.200", maxWidth: 300 }}>
                                        <Typography variant="body2">{msg.content}</Typography>
                                    </Paper>
                                </Box>
                            ))}
                            <div ref={messagesEndRef} />
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <TextField
                                value={messageText}
                                onChange={e => setMessageText(e.target.value)}
                                fullWidth
                                size="small"
                                placeholder="Type a message..."
                                onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
                            />
                            <Button onClick={handleSend} variant="contained" sx={{ ml: 1 }}>Send</Button>
                        </Box>
                    </>
                ) : (
                    <Typography variant="body1" sx={{ color: "gray", mt: 2 }}>Select a conversation to start messaging.</Typography>
                )}
            </Paper>
        </Box>
    );
}
