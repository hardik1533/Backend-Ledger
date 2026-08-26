const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({

    token: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

tokenBlacklistSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 3 }); // Set TTL index to expire after 3 days

const tokenBlacklistModel = mongoose.model('tokenBlacklist', tokenBlacklistSchema);

module.exports = tokenBlacklistModel;