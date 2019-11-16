// import node modules
const mongoose = require('mongoose');

// define schema
const QuestModelSchema = new mongoose.Schema ({
    title: String,
    description: String,
    exp: Number,
    coins: Number,
    parentId: mongoose.Schema.Types.ObjectId,
    childrenId: [mongoose.Schema.Types.ObjectId],
});

module.exports = mongoose.model('Quest', QuestModelSchema);