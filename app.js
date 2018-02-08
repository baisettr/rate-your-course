const express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ryc');
mongoose.Promise = global.Promise;
var courses = require('./views/courses.json');
var Review = require('./schema/review');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/scripts'));

app.set('port', (process.env.PORT || 3001));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    //and remove cacheing so we get the most recent comments
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/', function (req, res) {
    //res.sendFile('index.html');
    console.log("/");
    res.redirect('https://prometheus.eecs.oregonstate.edu/token?asid=8634941057606815&then=http%3A//localhost:3001/callback');
});
app.post('/callback', function (req, res) {
    console.log(req.body);
    request.get({
        url: 'https://prometheus.eecs.oregonstate.edu/token/v1',
        method: 'GET',
        headers: {
            'x-token': req.body.token,
            'x-joinkey': 'COKKNVBK'
        }
    }, function (err, response) {
        result = JSON.parse(response.body);
        console.log(result);
        if (result.isvalid) { res.redirect('../dept'); }
        else { res.redirect('../') }
    })

    //res.redirect('https://prometheus.eecs.oregonstate.edu/token?asid=6353211108641695&then=https%3A//web.engr.oregonstate.edu/%7Escaffidc/demo/index.php');
});

app.get('/dept', function (req, res) {
    res.sendFile(__dirname + '/views/dept.html');
});

app.get('/course', function (req, res) {
    var dep = req.query.depId;
    res.render('course.pug', { depId: dep });
    //res.sendFile(__dirname + '/views/course.html');
});

app.get('/delete', function (req, res) {
    res.sendFile(__dirname + '/views/delete.html');
});

app.get('/dep', function (req, res) {
    res.send(JSON.stringify(courses));
});

app.get('/crs', function (req, res) {
    var dep = req.query.depId;
    courses.forEach((c) => {
        if (c.depC === dep) {
            crs = c.courses;
        }
    })
    res.send(JSON.stringify(crs));
});

app.get('/reviews', function (req, res) {
    Review.find({ crsId: req.query.crsId })
        .then((reviews) => {
            console.log(reviews);
            res.send(JSON.stringify(reviews));
        });
});

app.post('/delete', function (req, res) {
    //console.log(req.body);
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/review', function (req, res) {
    var crsId = req.query.crsId;
    var depId = req.query.depId;
    res.render('review.pug', { depId: depId, crsId: crsId });
});

app.post('/review', function (req, res) {
    //console.log(req.body);
    var review = new Review({ crsId: req.body.crsId, pros: req.body.pros, cons: req.body.cons, stuff: req.body.extra, feedback: req.body.feedback, rating: req.body.star });
    console.log(review);
    review.save()
        .then(() => {
            console.log("save");
            //res.render('course.pug', { depId: req.body.crsId.match('[a-zA-Z]*')[0] });
            res.render('review.pug', { reviews: 'CS', crsId: req.body.crsId });
        });
})


app.listen(app.get('port'), function () {
    console.log("here");
});