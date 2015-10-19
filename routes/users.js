var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/studentdb');
var userdb = db.get('users');
var bcrypt = require('bcrypt');


/* GET users listing. */
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Sign Up' });
});

router.post('/signup', function (req, res, next) {
  var hash = bcrypt.hashSync(req.body.password, 8);
  req.session.email = req.body.email;
  userdb.insert({email: req.body.email, password: req.body.password}, function (err, credentials) {
    res.redirect('success');
  });
});

router.get('/success', function (req, res, next) {
  res.render('success', {title: 'SUCCESS!'})
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Log In' });
});

module.exports = router;
