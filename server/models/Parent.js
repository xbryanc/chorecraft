// import node modules
const mongoose = require('mongoose');

// define schema
const ParentSchema = new mongoose.Schema ({
    username: String,
    password: String,
    childrenId: [mongoose.Schema.Types.ObjectId],
});

module.exports = mongoose.model('Parent', ParentSchema);