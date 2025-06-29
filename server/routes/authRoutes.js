//importing dependencies
const mongoose = require("mongoose");
//fetching mongoose user model -> retrieves the user collection from MongoDB, assuming User Schema has been defined in mongoose model.
const User = mongoose.model("Users");
const TwoFactorCode = mongoose.model("TwoFactorCodes");
//import middlewares
const generateTwoFactorCode = require("../middlewares/generateTwoFactorCode");
const generateToken = require("../middlewares/generateToken");
const rateLimiter = require("../middlewares/rateLimiter");


//exporting the route as function 
module.exports = (app) => { 
    //route to handle user registration
    app.post("/api/v1/auth/register", async (req, res) => {
        //extract user details from request body
        const { name, email, password } = req.body;
        try {
            //check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }
            //create new user
            const user = await User.create({ name, email, password });
            return res.status(201).json({message: "User registered successfully", user});
        } catch(error){
            return res.status(400).json({ message: error.message });
        }
    });
    //route to handle user login
    app.post("/api/v1/auth/login", async (req, res) => 
    {
        //extract email and password from request body
        const { email, password } = req.body;
        try {
            //find user with matching email and password
            const user = await User.findOne({email, password});
            if(!user){
                //return error response if user not found
                return res.status(400).json({message: "Invalid email or password"});
            } else {
                //return success response with user details
                const token = generateToken({userId: user._id, email: user.email, name: user.name});
                return res.status(201).json({message: "Login successful", user, token});
                
            }
        } catch(error) {
            return res.status(400).json({message: error.mnessage});
        }
    });
    //route to update user info
    app.post("/api/v1/auth/update", async (req, res) => {
        //extract user details from request body
        const { name, email, phone, password } = req.body;
        try {
            const user = await User.findOne({email, password});
            //check user credentials
            if(!user){
                return res.status(400).json({message: "User not found"});
            } else {
                //update user details
                user.name = name;
                user.email = email;
                user.password = password;
                user.phone = phone;
                //save updated user details
                const response = await user.save();
                return res.status(200).json({message: "User updated successfully", user});
            }
        } catch (error) {
            return res.status(400).json({message: error.message});
        };
    });
    //route to send 2FA code to email
    app.post("/api/v1/auth/2fa/send-to-email", rateLimiter, async (req, res) => {
        //extract email from request body
        const { email } = req.body;
        try {
            //find user with matching email
            const user = await User.findOne({email});
            if(!user){
                return res.status(400).json({message: "User not found"});
            } else {
                //generate 2FA code
                const twoFactorCode = generateTwoFactorCode();
                //check if 2FA code already exists
                if(await TwoFactorCode.findOne({userId: user._id})){
                    //delete existing 2FA code
                    await TwoFactorCode.deleteOne({userId: user._id});
                }
                //send 2FA code to email
                const response = await TwoFactorCode.create({userId: user._id, twoFactorCode});
                console.log("Response: ", response);
                return res.status(200).json({message: "Code sent to email", email: user.email});
            }
        } catch (error) {
            return res.status(400).json({message: error.message});
        }
    });
    //route to verify 2FA code
    app.post("/api/v1/auth/2fa/verify", async (req, res) => {
        //extract 2FA code from request body
        const { email, twoFactorCode } = req.body;
        try {
            //find user with matching email
            const user = await User.findOne({email});
            if(!user){
                //return error response if user not found
                return res.status(400).json({message: "User not found"});
            }
            //find 2FA code with matching user id
            const twoFactorCodeFromDB = await TwoFactorCode.findOne({userId: user._id});
            if(!twoFactorCode){
                //return error response if 2FA code not found
                return res.status(400).json({message: "2FA code not found"});
            }
            //if 2FA code is found, verify 2FA code
            if(twoFactorCode === twoFactorCodeFromDB.twoFactorCode){
                // const payload = { userId: user._id, email: user.email, name: user.name };
                const token = generateToken({userId: user._id, email: user.email, name: user.name});
                // const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME });
                return res.status(200).json({message: "2FA code verified", token});
            } else {
                return res.status(400).json({message: "Invalid 2FA code"});
            }
        } catch (error) {
            return res.status(400).json({message: error.message});
        }
    });
};
