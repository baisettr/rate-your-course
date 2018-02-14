const express = require('express');
router = express.Router();
var path = require('path');
var courses = require('../views/courses.json');

router.get('/', function (req, res, next) {
    //res.sendFile(path.join(__dirname, '..', '/views', 'dept.html'));
    res.render('dept.pug');
});

router.get('/depts', function (req, res, next) {
    res.send(JSON.stringify(courses));
});

router.post('/addDept', function (req, res, next) {
    console.log(req.body);
    res.json({ done: true });
});

router.post('/post', function (req, res) {

});

module.exports = router;