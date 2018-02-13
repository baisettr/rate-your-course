const express = require('express');
router = express.Router();
var courses = require('../views/courses.json');


router.get('/course', function (req, res, next) {
    var depId = req.query.depId;
    res.render('course.pug', { depId: depId });
});

router.get('/courses', function (req, res, next) {
    var deptId = req.query.deptId;
    courses.forEach((c) => {
        if (c.depC === deptId) {
            deptCourses = c.courses;
        }
    })
    res.send(JSON.stringify(deptCourses));
});


router.post('/addCourse', function (req, res, next) {

});