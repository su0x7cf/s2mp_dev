const mongoose = require("mongoose");

const twoFactorCodeSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        twoFactorCode: { type: String },
        createdAt: {
            type: Date,
            default: Date.now,
            
          }
    }
)

twoFactorCodeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

module.exports = mongoose.model("TwoFactorCodes", twoFactorCodeSchema);