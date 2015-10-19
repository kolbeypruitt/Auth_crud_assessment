var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/studentdb');
var studentdb = db.get('students');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'please sign up or login' });
});

router.get('/students', function(req, res, next) {
  studentdb.find({}, function (err, records) {
    res.render('students/index', {allStudents: records});
  });
});

router.get('/signout', function(req, res, next) {
  req.session = null;
  res.render('index', { title: "You've been signed out"});
});
module.exports = router;
