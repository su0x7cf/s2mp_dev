//importing dependencies
const mongoose = require("mongoose");
//fetching mongoose user model -> retrieves the user collection from MongoDB, assuming User Schema has been defined in mongoose model.
const User = mongoose.model("Users");
const TwoFactorCode = mongoose.model("TwoFactorCodes");
//import middlewares
const generateTwoFactorCode = require("../middlewares/generateTwoFactorCode");
const generateToken = require("../middlewares/generateToken");
const rateLimiter = require("../middlewares/rateLimiter");
const multer = require("multer");
const path = require("path");

// Set up multer for avatar uploads
const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../object/uploads/"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-avatar-" + file.originalname);
    }
});
const avatarUpload = multer({ storage: avatarStorage }).single("avatar");

//exporting the route as function 
module.exports = (app) => {
    //route to handle user registration
    app.post("/api/v1/auth/register", async (req, res) => {
        //extract user details from request body
        const { username, email, password } = req.body;
        try {
            //check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }
            //create new user
            const user = await User.create({ username, email, password });
            return res.status(201).json({ message: "User registered successfully", user });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });
    //route to handle user login
    app.post("/api/v1/auth/login", async (req, res) => {
        //extract email and password from request body
        const { email, password } = req.body;
        try {
            //find user with matching email and password
            const user = await User.findOne({ email, password });
            if (!user) {
                //return error response if user not found
                return res.status(400).json({ message: "Invalid email or password" });
            } else {
                //return success response with user details
                const token = generateToken({ userId: user._id, email: user.email, username: user.username });
                return res.status(201).json({ message: "Login successful", user, token });

            }
        } catch (error) {
            return res.status(400).json({ message: error.mnessage });
        }
    });
    //route to update user info
    app.post("/api/v1/auth/update", async (req, res) => {
        //extract user details from request body
        const { username, email, phone, password } = req.body;
        try {
            const user = await User.findOne({ email, password });
            //check user credentials
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            } else {
                //update user details
                user.username = username;
                user.email = email;
                user.password = password;
                user.phone = phone;
                //save updated user details
                const response = await user.save();
                return res.status(200).json({ message: "User updated successfully", user });
            }
        } catch (error) {
            return res.status(400).json({ message: error.message });
        };
    });
    //route to send 2FA code to email
    app.post("/api/v1/auth/2fa/send-to-email", rateLimiter, async (req, res) => {
        //extract email from request body
        const { email } = req.body;
        try {
            //find user with matching email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            } else {
                //generate 2FA code
                const twoFactorCode = generateTwoFactorCode();
                //check if 2FA code already exists
                if (await TwoFactorCode.findOne({ userId: user._id })) {
                    //delete existing 2FA code
                    await TwoFactorCode.deleteOne({ userId: user._id });
                }
                //send 2FA code to email
                const response = await TwoFactorCode.create({ userId: user._id, twoFactorCode });
                console.log("Response: ", response);
                return res.status(200).json({ message: "Code sent to email", email: user.email });
            }
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });
    //route to verify 2FA code
    app.post("/api/v1/auth/2fa/verify", async (req, res) => {
        //extract 2FA code from request body
        const { email, twoFactorCode } = req.body;
        try {
            //find user with matching email
            const user = await User.findOne({ email });
            if (!user) {
                //return error response if user not found
                return res.status(400).json({ message: "User not found" });
            }
            //find 2FA code with matching user id
            const twoFactorCodeFromDB = await TwoFactorCode.findOne({ userId: user._id });
            if (!twoFactorCode) {
                //return error response if 2FA code not found
                return res.status(400).json({ message: "2FA code not found" });
            }
            //if 2FA code is found, verify 2FA code
            if (twoFactorCode === twoFactorCodeFromDB.twoFactorCode) {
                // const payload = { userId: user._id, email: user.email, username: user.username };
                const token = generateToken({ userId: user._id, email: user.email, username: user.username });
                // const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME });
                return res.status(200).json({ message: "2FA code verified", token });
            } else {
                return res.status(400).json({ message: "Invalid 2FA code" });
            }
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });
    // Add a /me endpoint to get current user info from token
    app.post("/api/v1/auth/me", async (req, res) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ message: "No token provided" });
            }
            const token = authHeader.split(" ")[1];
            const payload = generateToken.verify(token);
            const user = await User.findOne({ _id: payload.userId });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({ user });
        } catch (err) {
            res.status(401).json({ message: "Invalid token" });
        }
    });
    // Follow a user
    app.post("/api/v1/users/:id/follow", async (req, res) => {
        const userId = req.body.userId; // the follower
        const targetId = req.params.id; // the user to be followed
        if (!userId || !targetId) return res.status(400).json({ error: "userId and targetId required" });
        if (userId === targetId) return res.status(400).json({ error: "Cannot follow yourself" });
        const User = mongoose.model("Users");
        try {
            await User.findByIdAndUpdate(userId, { $addToSet: { following: targetId } });
            await User.findByIdAndUpdate(targetId, { $addToSet: { followers: userId } });
            res.status(200).json({ message: "Followed" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Unfollow a user
    app.post("/api/v1/users/:id/unfollow", async (req, res) => {
        const userId = req.body.userId; // the follower
        const targetId = req.params.id; // the user to be unfollowed
        if (!userId || !targetId) return res.status(400).json({ error: "userId and targetId required" });
        if (userId === targetId) return res.status(400).json({ error: "Cannot unfollow yourself" });
        const User = mongoose.model("Users");
        try {
            await User.findByIdAndUpdate(userId, { $pull: { following: targetId } });
            await User.findByIdAndUpdate(targetId, { $pull: { followers: userId } });
            res.status(200).json({ message: "Unfollowed" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Get followers
    app.get("/api/v1/users/:id/followers", async (req, res) => {
        const User = mongoose.model("Users");
        try {
            const user = await User.findById(req.params.id).populate("followers", "username email");
            res.status(200).json({ followers: user.followers });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Get following
    app.get("/api/v1/users/:id/following", async (req, res) => {
        const User = mongoose.model("Users");
        try {
            const user = await User.findById(req.params.id).populate("following", "username email");
            res.status(200).json({ following: user.following });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
    // User search endpoint (by name only)
    app.get("/api/v1/users/search", async (req, res) => {
        const q = req.query.q || "";
        const User = mongoose.model("Users");
        try {
            const users = await User.find({
                username: { $regex: q, $options: "i" }
            }, "_id username email");
            res.status(200).json({ users });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Avatar upload endpoint
    app.post("/api/v1/users/:id/avatar", (req, res) => {
        avatarUpload(req, res, async function (err) {
            if (err) return res.status(400).json({ error: err.message });
            if (!req.file) return res.status(400).json({ error: "No file uploaded" });
            const User = mongoose.model("Users");
            try {
                const user = await User.findByIdAndUpdate(
                    req.params.id,
                    { avatar: req.file.filename },
                    { new: true }
                );
                res.status(200).json({ message: "Avatar uploaded", avatar: req.file.filename, user });
            } catch (e) {
                res.status(500).json({ error: e.message });
            }
        });
    });
    // Save a post (bookmark)
    app.post("/api/v1/posts/:src/save", async (req, res) => {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: "userId required" });
        try {
            const Post = mongoose.model("Posts");
            const post = await Post.findOne({ src: req.params.src });
            if (!post) return res.status(404).json({ error: "Post not found" });
            const user = await User.findByIdAndUpdate(
                userId,
                { $addToSet: { savedPosts: post._id } },
                { new: true }
            ).populate("savedPosts");
            res.status(200).json({ message: "Post saved", user });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Unsave a post (remove bookmark)
    app.post("/api/v1/posts/:src/unsave", async (req, res) => {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: "userId required" });
        try {
            const Post = mongoose.model("Posts");
            const post = await Post.findOne({ src: req.params.src });
            if (!post) return res.status(404).json({ error: "Post not found" });
            const user = await User.findByIdAndUpdate(
                userId,
                { $pull: { savedPosts: post._id } },
                { new: true }
            ).populate("savedPosts");
            res.status(200).json({ message: "Post unsaved", user });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Get all saved posts for a user
    app.get("/api/v1/users/:id/saved-posts", async (req, res) => {
        try {
            const user = await User.findById(req.params.id).populate({
                path: "savedPosts",
                populate: { path: "userId", select: "username avatar" }
            });
            if (!user) return res.status(404).json({ error: "User not found" });
            res.status(200).json({ savedPosts: user.savedPosts });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
};
