const mongoose = require('mongoose');
const schema = mongoose.Schema;

const ReviewSchema = new schema({
    courseId: String,
    courseTerm: String,
    coursePros: String,
    courseCons: String,
    courseLinks: String,
    courseTips: String,
    courseFeedback: String,
    courseRating: Number,
    courseOverall: Number,
    postedDate: Date
});

const Review = mongoose.model('review', ReviewSchema);

module.exports = Review;