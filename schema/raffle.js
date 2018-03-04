const mongoose = require('mongoose');
const schema = mongoose.Schema;

const RaffleSchema = new schema({
    emailId: String,
    postedDate: { type: Date, default: Date.now() }
});

const Raffle = mongoose.model('raffle', RaffleSchema);
module.exports = Raffle;