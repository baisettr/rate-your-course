const express = require('express');
router = express.Router();

var courses = require('../views/courses.json');
var Review = require('../schema/review');
var Raffle = require('../schema/raffle');
var Winner = require('../schema/winner');
var utilEmail = require('./utilEmail');

function g(n) {
    return Math.floor(Math.random() * (n))
}

function checkForRaffle(count) {
    return new Promise((resolve, reject) => {
        var raffle = { 'check': false, 'raffleAmount': 10 };
        switch (true) {
            case (count >= 10 && count < 50):
                raffle.raffleAmount = 10;
                break;
            case (count >= 50 && count < 100):
                raffle.raffleAmount = 10;
                break;
            case (count === 100):
                raffle.check = true;
                raffle.raffleAmount = 10;
                break;
            case (count > 100 && count < 500):
                raffle.raffleAmount = 20;
                break;
            case (count === 500):
                raffle.check = true;
                raffle.raffleAmount = 20;
                break;
            case (count > 500 && count < 1000):
                raffle.raffleAmount = 25;
                break;
            case (count === 1000):
                raffle.check = true;
                raffle.raffleAmount = 25;
                break;
            case (count > 1000 && count < 5000):
                raffle.raffleAmount = 35;
                break;
            case (count === 5000):
                raffle.check = true;
                raffle.raffleAmount = 35;
                break;
            case (count > 5000 && count < 10000):
                raffle.raffleAmount = 50;
                break;
            case (count === 10000):
                raffle.check = true;
                raffle.raffleAmount = 50;
                break;
            case (count > 10000):
                raffle.raffleAmount = 100;
                break;
        }
        resolve(raffle);
    })
}

function findWinner() {
    return new Promise((resolve, reject) => {
        Raffle.find({}).select('emailId -_id')
            .then((res) => {
                //console.log(res);
                if (res.length) {
                    randomNumber = g(res.length);
                    winner = res[randomNumber].emailId;
                    resolve(winner);
                }
                else {
                    resolve('baisettr@engr.orst.edu');
                }
            })
            .catch((err) => { reject(err); })
    })
}

function checkLastWinnerCount() {

    return new Promise((resolve, reject) => {
        Winner.find({}).sort('-postedDate')
            .then((res) => {
                if (res.length) {
                    resolve(res[0].countReviews);
                }
                else {
                    resolve(0);
                }
            })
            .catch((err) => { reject(err); })
    })
}

function addWinner(emailId, reviewCount) {

    return new Promise((resolve, reject) => {
        winner = new Winner({ emailId: emailId, countReviews: reviewCount })
        winner.save()
            .then(() => { resolve(); })
            .catch((err) => { reject(err); })
    })
}

function sendEmail(emailId, raffleAmount) {
    //console.log(emailId, raffleAmount);
    return new Promise((resolve, reject) => {
        var subject = 'Rate Your Course Raffle Winner!';
        var content = 'You won the raffle worth $' + raffleAmount + '. Please contact me (mailto:baisettr@engr.orst.edu) to claim it.\n\nThanks\nRama\n\nNotes: The winner will be crosschecked (*it is a new system there might occur some server issues) by the admin and will be rewarded.'
        utilEmail.sendEmail('r@engr.orst.edu', emailId, subject, content, (err) => {
            if (err) { reject(err); }
            else { resolve(); };
        })
    })
}

router.get('/', function (req, res, next) {
    var courseName = req.query.courseName;
    var courseId = req.query.courseId;
    var deptId = req.query.deptId;
    res.render('review.pug', { deptId: deptId, courseId: courseId, courseName: courseName });
});

router.get('/count', function (req, res, next) {
    var winnerEmailId = 'Announcing Soon!';
    var raffleAmount = 10;
    var raffleCheck = false;
    Review.count({})
        .then((reviewCount) => {
            Raffle.count({})
                .then((userCount) => {
                    //console.log(reviewCount, userCount);
                    checkForRaffle(reviewCount)
                        .then((raffle) => {
                            //console.log(raffle);
                            raffleAmount = raffle.raffleAmount;
                            raffleCheck = raffle.check;
                            if (raffleCheck) {
                                checkLastWinnerCount()
                                    .then((lastCount) => { //console.log(lastCount);
                                        if (reviewCount > lastCount) { return findWinner(); } else { return 'Announcing Soon!' }
                                    })
                                    .then((emailId) => { //console.log(emailId);
                                        winnerEmailId = emailId; if (winnerEmailId !== 'Announcing Soon!') { return addWinner(emailId, reviewCount); }
                                    })
                                    .then(() => { //console.log('saved');
                                        if (winnerEmailId !== 'Announcing Soon!') { return sendEmail(winnerEmailId, raffleAmount); }
                                    })
                                    .then(() => { //console.log('mailed'); 
                                        res.json({ reviewCount: reviewCount, userCount: userCount, raffleAmount: raffleAmount, raffleWinner: winnerEmailId });
                                    })
                                    .catch((err) => { console.log(err) });
                            }
                            else {
                                res.json({ reviewCount: reviewCount, userCount: userCount, raffleAmount: raffleAmount, raffleWinner: winnerEmailId });
                            }
                        }).catch((err) => { console.log(err) });
                })
                .catch((err) => { console.log(err); })
        })
        .catch((err) => { console.log(err); })
});

router.get('/reviews', function (req, res, next) {
    var courseId = req.query.courseId;
    var averageRating = [{ avgTotal: 0 }];
    Review.find({ courseId: courseId }).sort('-postedDate')
        .then((courseReviews) => {
            //Review.aggregate([{ $group: { _id: "$courseTerm", avgTerm: { $avg: "$courseRating" } } }]).sort('avgTerm')
            Review.aggregate([{ $match: { courseId: courseId } }, { $group: { _id: "$courseId", avgTotal: { $avg: "$courseRating" } } }])
                .then((rating) => {
                    //console.log(rating);
                    if (rating.length) averageRating = rating;
                    res.send(JSON.stringify({ courseReviews: courseReviews, averageRating: averageRating[0]['avgTotal'] }));
                })
                .catch((err) => {
                    console.log(err);
                })
            //console.log(courseReviews);
        })
        .catch((err) => {
            console.log(err);
        })
});


router.post('/addReview', function (req, res, next) {
    //console.log(req.body);
    var review = new Review({ courseId: req.body.courseId, courseTerm: req.body.courseTerm, courseProf: req.body.courseProf, coursePros: req.body.coursePros, courseCons: req.body.courseCons, courseLinks: req.body.courseLinks, courseTips: req.body.courseTips, courseFeedback: req.body.courseFeedback, courseRating: req.body.courseRating, courseOverall: req.body.courseOverall, postedDate: Date.now() });
    //console.log(review);
    review.save()
        .then(() => {
            //console.log("save");
            //res.render('course.pug', { deptId: req.body.crsId.match('[a-zA-Z]*')[0] });
            res.send(JSON.stringify(review));
            //res.json({ 'a': 1 });
        })
        .catch((err) => {
            console.log(err);
        })
});

router.post('/addRaffle', function (req, res, next) {
    //console.log(req.body);
    var onid = req.body.emailId.split('@')[0];
    var raffle = new Raffle({ emailId: req.body.emailId });
    Raffle.findOne({ emailId: { $in: [onid + '@oregonstate.edu', onid + '@engr.orst.edu'] } }, {}, { sort: { postedDate: -1 } })
        .then((data) => {
            //console.log(data);
            if (!data) {
                raffle.save()
                    .then(() => {
                        res.json({ done: true, message: 'Yay! Successfully Registered.' });
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
            else if (Math.floor((Date.now() - data.postedDate) / (1000 * 60 * 60)) >= 24) {
                //console.log(Math.floor((Date.now() - data.postedDate) / (1000 * 60 * 60)))
                raffle.save()
                    .then(() => {
                        res.json({ done: true, message: 'Yum! Registering daily, Liked it.' });
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
            else {
                res.json({ done: true, message: 'Phew! You already registered today.' });
            }
        })
        .catch((err) => {
            console.log(err);
        })
});

module.exports = router;