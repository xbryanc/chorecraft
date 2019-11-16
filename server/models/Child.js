// import node modules
const mongoose = require('mongoose');

// define schema
const ChildSchema = new mongoose.Schema ({
    username: String,
    password: String,
    exp: Number,
    coins: Number,
    parentId: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model('Child', ChildSchema);
