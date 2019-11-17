// import node modules
const mongoose = require('mongoose');

// define schema
const ChildSchema = new mongoose.Schema ({
    username: String,
    password: String,
    exp: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
    isParent: Boolean,
    parentId: mongoose.Schema.Types.ObjectId,
    wishlist: [mongoose.Schema.Types.ObjectId]
});

ChildSchema.pre('save', function() {
    this.isParent = false;
});

module.exports = mongoose.model('Child', ChildSchema);
