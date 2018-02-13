const express = require('express');
router = express.Router();
var courses = require('../views/courses.json');

router.get('/', function (req, res, next) {
    res.sendFile(__dirname + '../views/dept.html');
});

router.get('/depts', function (req, res, next) {
    res.send(JSON.stringify(courses));
});

router.post('/addDept', function (req, res, next) {

});

router.post('/post', function (req, res) {
    console.log(req.body);
    res.json({ done: true });
});