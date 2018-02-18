const express = require('express');
router = express.Router();

var courses = require('../views/courses.json');
var Review = require('../schema/review');


router.get('/', function (req, res, next) {
    var courseName = req.query.courseName;
    var courseId = req.query.courseId;
    var deptId = req.query.deptId;
    res.render('review.pug', { deptId: deptId, courseId: courseId, courseName: courseName });
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
    var review = new Review({ courseId: req.body.courseId, courseTerm: req.body.courseTerm, coursePros: req.body.coursePros, courseCons: req.body.courseCons, courseLinks: req.body.courseLinks, courseTips: req.body.courseTips, courseFeedback: req.body.courseFeedback, courseRating: req.body.courseRating, courseOverall: req.body.courseOverall, postedDate: Date.now() });
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

module.exports = router;