const express = require('express');
router = express.Router();
var courses = require('../views/courses.json');
var Course = require('../schema/course');


router.get('/', function (req, res, next) {
    var deptId = req.query.deptId;
    res.render('course.pug', { deptId: deptId });
});

router.get('/courses', function (req, res, next) {
    var deptId = req.query.deptId;
    courses.forEach((c) => {
        if (c.depC === deptId) {
            deptCourses = c.courses;
        }
    })
    Course.find({ deptId: deptId })
        .then((data) => {
            data.map((course) => {
                deptCourses.push({ crsNr: course.courseId, crsNme: course.courseName });
            })

            res.send(JSON.stringify(deptCourses));
        })
        .catch((err) => {
            console.log(err);
        })
});


router.post('/addCourse', function (req, res, next) {
    //console.log(req.body);
    var course = new Course({ courseId: req.body.crsNr, courseName: req.body.crsNme, deptId: req.body.deptId });
    //console.log(course);
    course.save()
        .then(() => {
            res.json({ done: true });
        })
        .catch((err) => {
            console.log(err);
        })
});

module.exports = router;