var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/studentdb');
var studentdb = db.get('students');



/* GET students listing. */
router.get('/', function(req, res, next) {
  res.render('students', { title: 'students page' });
});

router.post('/', function(req, res, next) {
  studentCollection.insert({ name: req.body.student_name, phone: req.body.student_phone }, function(err, student) {
    studentdb.find({}, function (err, records) {
      res.render('students/index', {allStudents: records});
    });
  });
});

module.exports = router