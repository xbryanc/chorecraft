// import node modules
const mongoose = require('mongoose');

// define schema
const ChildSchema = new mongoose.Schema ({
    username: String,
    password: String,
    exp: Number,
    coins: Number,
    isParent: Boolean,
    parentId: mongoose.Schema.Types.ObjectId,
});

ChildSchema.pre('save', function() {
    this.isParent = false;
});

module.exports = mongoose.model('Child', ChildSchema);
