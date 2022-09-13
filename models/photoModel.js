const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
    albumId: Number,
    id: Number,
    title: String,
    url: String,
    thumbnailUrl: String
})

var Photo = module.exports = mongoose.model('photos', photoSchema);
