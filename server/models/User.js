const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: { type: String },
        password: { type: String },
        phone: { type: String },
        twoFactorEnabled: { type: Boolean, default: false },
        lastLogin: { type: Date, default: Date.now},
    },
    {
        timestamps: true
    }
)

mongoose.model("Users", userSchema);