// import node modules
const mongoose = require('mongoose');

// define schema
const RewardSchema = new mongoose.Schema ({
    title: String,
    description: String,
    cost: Number,
    parentId: mongoose.Schema.Types.ObjectId,
    purchasedBy: [mongoose.Schema.Types.ObjectId],
});

module.exports = mongoose.model('Reward', RewardSchema);
