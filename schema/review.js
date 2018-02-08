const mongoose = require('mongoose');
const schema = mongoose.Schema;

const ReviewSchema = new schema({
    crsId: String,
    pros: String,
    cons: String,
    stuff: String,
    feedback: String,
    rating: Number
});

const Review = mongoose.model('reviews', ReviewSchema);

module.exports = Review;