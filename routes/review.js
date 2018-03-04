const express = require('express');
router = express.Router();

var courses = require('../views/courses.json');
var Review = require('../schema/review');
var Raffle = require('../schema/raffle');


router.get('/', function (req, res, next) {
    var courseName = req.query.courseName;
    var courseId = req.query.courseId;
    var deptId = req.query.deptId;
    res.render('review.pug', { deptId: deptId, courseId: courseId, courseName: courseName });
});

router.get('/count', function (req, res, next) {
    Review.count({})
        .then((reviews) => {
            Raffle.count({})
                .then((users) => {
                    res.json({ reviewCount: reviews, userCount: users });
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err);
        })
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
                        res.json({ done: true });
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
            else if (Math.floor((Date.now() - data.postedDate) / (1000 * 60 * 60)) >= 24) {
                //console.log(Math.floor((Date.now() - data.postedDate) / (1000 * 60 * 60)))
                raffle.save()
                    .then(() => {
                        res.json({ done: true });
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
            else {
                res.json({ done: true });
            }
        })
        .catch((err) => {
            console.log(err);
        })
});

module.exports = router;