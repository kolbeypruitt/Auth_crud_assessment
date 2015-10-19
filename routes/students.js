var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/studentdb');
var studentdb = db.get('students');



/* GET students listing. */
router.get('/', function(req, res, next) {
  studentdb.find({}, function (err, records) {
    res.render('students/index', {allStudents: records});
  });
});

router.post('/', function(req, res, next) {
  var errors = [];
  if (!req.body.student_name.trim()) {
    errors.push("* student's name must be provided")
  }
  if (!req.body.student_phone.trim()) {
    errors.push("* student's phone number must be provided")
  }
  if (errors.length>0) {
    res.render('students/add', {errors: errors})
  } else {
    studentdb.insert({ name: req.body.student_name, phone: req.body.student_phone }, function(err, student) {
      studentdb.find({}, function (err, records) {
        res.render('students/index', {allStudents: records});
      });
    });
  }
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

router.post('/:id/update', function(req, res, next) {
  studentdb.update({ _id: req.params.id }, { name: req.body.student_name, phone: req.body.student_phone }, function(err, student) {
    studentdb.find({}, function (err, records) {
      res.render('students/index', {allStudents: records});
    });
  });
});

router.get('/:id/remove', function(req, res, next) {
  studentdb.remove({_id: req.params.id}, function (err, record) {
    studentdb.find({}, function (err, records) {
      res.render('students/index', {allStudents: records});
    });
  });
});
module.exports = router