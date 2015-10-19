var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/studentdb');
var studentdb = db.get('students');



/* GET students listing. */
router.get('/', function(req, res, next) {
  res.render('students/index', { title: 'students page' });
});

router.post('/', function(req, res, next) {
  studentdb.insert({ name: req.body.student_name, phone: req.body.student_phone }, function(err, student) {
    studentdb.find({}, function (err, records) {
      res.render('students/index', {allStudents: records});
    });
  });
});

router.get('/add', function(req, res, next) {
  res.render('students/add');
});

router.get('/:id', function(req, res, next) {
  studentdb.findOne({_id: req.params.id}, function (err, record) {
    res.render('students/show', {theStudent: record});
  });
});

router.get('/:id/edit', function(req, res, next) {
  studentdb.findOne({_id: req.params.id}, function (err, record) {
    res.render('students/edit', {theStudent: record});
  });
});

module.exports = router