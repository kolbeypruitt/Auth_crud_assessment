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
  userdb.insert({email: req.session.email, password: hash}, function (err, credentials) {
    res.redirect('success');
  });
});

router.get('/success', function (req, res, next) {
  res.render('success', {title: 'SUCCESS!', email: req.session.email})
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Log In' });
});


router.post('/login', function (req, res, next) {
  userdb.findOne({email: req.body.email}, function (err, user) {
    if (user) {
      var comparedHash = bcrypt.compareSync(req.body.password, user.password)
      if (comparedHash) {
        req.session.email = user.email;
        res.redirect('success');
      }
    }
    else {
      req.session = null;
      res.redirect('users/login');
    }
  });
});

module.exports = router;
