const express = require('express');
const router = express.Router();
var request = require('request');


router.get('/', function (req, res, next) {
    res.render('index.pug');
    //res.redirect('https://prometheus.eecs.oregonstate.edu/token?asid=8634941057606815&then=http%3A//localhost:3001/callback');
});

router.post('/callback', function (req, res) {
    //console.log(req.body);
    request.get({
        url: 'https://prometheus.eecs.oregonstate.edu/token/v1',
        method: 'GET',
        headers: {
            'x-token': req.body.token,
            'x-joinkey': 'COKKNVBK'
        }
    }, function (err, response) {
        result = JSON.parse(response.body);
        //console.log(result);
        if (result.isvalid) {
            req.session.isvalid = true;
            res.redirect('./univ/dept');
        }
        else { res.redirect('/') }
    })
});

module.exports = router;