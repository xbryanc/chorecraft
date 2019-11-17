// import node modules
const mongoose = require('mongoose');

// define schema
const HistoryEntrySchema = new mongoose.Schema ({
    childId: mongoose.Schema.Types.ObjectId,
    questId: mongoose.Schema.Types.ObjectId,
    oldExp: Number,
    newExp: Number,
    oldCoins: Number,
    newCoins: Number,
});

module.exports = mongoose.model('HistoryEntry', HistoryEntrySchema);
