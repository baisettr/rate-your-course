const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UniversitySchema = new schema({
    univId: String,
    univName: String,
    univAddress: String,
    univCity: String,
    univState: String,
    univZip: Number
});

const University = mongoose.model('university', UniversitySchema);
module.exports = University;