// import node modules
const mongoose = require('mongoose');

// define schema
const ParentSchema = new mongoose.Schema ({
    username: String,
    password: String,
    isParent: Boolean,
    childrenId: [mongoose.Schema.Types.ObjectId],
});

ParentSchema.pre('save', function() {
    this.isParent = true;
});

module.exports = mongoose.model('Parent', ParentSchema);