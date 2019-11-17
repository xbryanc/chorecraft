// import node modules
const mongoose = require('mongoose');

// define schema
const HistoryEntrySchema = new mongoose.Schema ({
    childId: mongoose.Schema.Types.ObjectId,
    questId: mongoose.Schema.Types.ObjectId,
    rewardId: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    isQuest: Boolean,
    oldExp: Number,
    newExp: Number,
    oldCoins: Number,
    newCoins: Number,
    timestamp: Number,
});

module.exports = mongoose.model('HistoryEntry', HistoryEntrySchema);
