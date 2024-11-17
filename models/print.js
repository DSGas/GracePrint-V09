const   mongoose        = require('mongoose');

const printSchema = new mongoose.Schema({
    name: String,
    artist: String,
    image: String,
    author:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

module.exports = mongoose.model('Print',printSchema);