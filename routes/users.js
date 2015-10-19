var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/studentdb');
var userdb = db.get('users');
var bcrypt = require('bcrypt');


/* GET users listing. */
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Sign Up' });
});


router.post('/signin', function (req, res) {
  var errors = [];
  var hash = bcrypt.hashSync(req.body.password, 8);
  req.session.email = req.body.email;

  if (!req.body.email.trim()) {
    errors.push("* email can't be blank")
  }
  if (!req.body.password.trim()) {
    errors.push("* password can't be blank")
  }
  if (!req.body.passwordv.trim()) {
    errors.push("* verify password can't be blank")
  }
  if (req.body.passwordv.trim() !== req.body.password.trim()) {
    errors.push("* password inputs don't match")
  }
  if (errors.length>0) {
    res.render('signup', {errors: errors})
  } else {
    userdb.insert({email: req.session.email, password: hash}, function (err, credentials) {
      res.redirect('success');
    })
  }
})


// router.post('/signup', function (req, res, next) {
//   var hash = bcrypt.hashSync(req.body.password, 8);
//   req.session.email = req.body.email;
//   if (req.body.email.trim()) {
//     userdb.insert({email: req.session.email, password: hash}, function (err, credentials) {
//       res.redirect('success');
//     });
//   } else {
//     res.render('signup', {errors: ["* Email can't be blank"]})
//   }
// });

router.get('/success', function (req, res, next) {
  res.render('success', {title: 'SUCCESS!', email: req.session.email})
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Log In' });
});



router.post('/login', function (req, res) {
  var errors = [];
  if (!req.body.email.trim()) {
    errors.push("* email can't be blank")
  }
  if (!req.body.password.trim()) {
    errors.push("* password can't be blank")
  }
  if (errors.length>0) {
    res.render('login', {errors: errors})
  } else {
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
  }
})

module.exports = router;
