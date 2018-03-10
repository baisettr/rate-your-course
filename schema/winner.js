const mongoose = require('mongoose');
const schema = mongoose.Schema;

const WinnerSchema = new schema({
    emailId: String,
    postedDate: { type: Date, default: Date.now() },
    countReviews: Number
});

const Winner = mongoose.model('winner', WinnerSchema);
module.exports = Winner;