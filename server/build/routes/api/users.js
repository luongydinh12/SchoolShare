"use strict";

var express = require("express");

var router = express.Router();

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var keys = require("../../config/keys");

var gravatar = require('gravatar'); // Load input validation


var validateRegisterInput = require("../../validation/register");

var validateLoginInput = require("../../validation/login"); // Load User model


var User = require("../../models/User");

var passport = require("passport");

var GoogleStrategy = require('passport-google-oauth20').Strategy;

var FacebookStrategy = require('passport-facebook').Strategy;

var app = express();

var http = require('http').Server(app);

var io = require('socket.io')(http);

app.set('io', io);

var addSocketIdtoSession = function addSocketIdtoSession(req, res, next) {
  req.session.socketId = req.query.socketId;
  next();
};

io.on('connection', function (socket) {
  console.log("socket.io connected", socket.id);
  socket.on('disconnect', function () {
    console.log("socket.io disconnected", socket.id);
  });
  socket.on('example_message', function (msg) {
    console.log('message:\t' + msg + "\t id:\t" + socket.id); // socket.emit('example_response','response msg');
  });
});
io.listen(5050); //Get (test)

router.get('/', function (req, res) {
  res.send('Users');
}); // @route POST api/users/register
// @desc Register user
// @access Public

router.post("/register", function (req, res) {
  // Form validation
  var _validateRegisterInpu = validateRegisterInput(req.body),
      errors = _validateRegisterInpu.errors,
      isValid = _validateRegisterInpu.isValid; // Check validation


  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({
    email: req.body.email
  }).then(function (user) {
    if (user) {
      return res.status(400).json({
        email: "Email already exists"
      });
    } else {
      //Create Empty Profile:
      var avatar = gravatar.url(req.body.email, {
        s: '200',
        // Size
        r: 'pg',
        // Rating
        d: 'mm' // Default

      });
      var newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password
      }); // Hash password before saving in database

      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
          if (err) throw err;
          newUser.password = hash;
          newUser.save().then(function (user) {
            return res.json(user);
          })["catch"](function (err) {
            return console.log(err);
          });
        });
      });
    }
  });
});
router.post("/test", function (req, res) {
  console.log("test");
  return res.json({
    test: true
  });
});
router.get("/google", addSocketIdtoSession, passport.authenticate('google', {
  scope: ["profile", "email"]
}));
router.get("/facebook", addSocketIdtoSession, passport.authenticate('facebook', {
  scope: ["email"]
}));
router.get("/googlecallback", passport.authenticate("google", {
  scope: ["profile", "email"]
}), function (req, res) {
  var u = req.user;
  var payload = {
    id: u.id,
    name: u.name,
    email: u.email,
    date: u.date,
    avatar: u.avatar,
    description: u.description
  };
  var token = jwt.sign(payload, keys.db.secretOrKey, {
    expiresIn: 31556926 // 1 year in seconds

  });
  var io = app.get('io'); //console.log("token: ",token);

  io["in"](req.session.socketId).emit('google', "Bearer " + token);
  return res.end("<script>\n    window.close();\n</script>");
});
router.get("/facebookcallback", passport.authenticate("facebook", {
  scope: ["email"]
}), function (req, res) {
  var u = req.user;
  var payload = {
    id: u.id,
    name: u.name,
    email: u.email,
    date: u.date,
    avatar: u.avatar,
    description: u.description
  };
  var token = jwt.sign(payload, keys.db.secretOrKey, {
    expiresIn: 31556926 // 1 year in seconds

  });
  var io = app.get('io'); //console.log("token: ",token);

  io["in"](req.session.socketId).emit('facebook', "Bearer " + token);
  return res.end("<script>\n    window.close();\n</script>");
}); // @route POST api/users/login
// @desc Login user and return JWT token
// @access Public

router.post("/login", function (req, res) {
  // Form validation
  var _validateLoginInput = validateLoginInput(req.body),
      errors = _validateLoginInput.errors,
      isValid = _validateLoginInput.isValid; // Check validation


  if (!isValid) {
    return res.status(400).json(errors);
  }

  var email = req.body.email;
  var password = req.body.password; // Find user by email

  User.findOne({
    email: email
  }).then(function (user) {
    // Check if user exists
    if (!user) {
      return res.status(404).json({
        emailnotfound: "Email not found"
      });
    } // Check password


    bcrypt.compare(password, user.password).then(function (isMatch) {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        var payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          date: user.date,
          //googleId: user.googleId,
          //facebookId: user.facebookId,
          avatar: user.avatar,
          description: user.description
        }; // Sign token

        jwt.sign(payload, keys.db.secretOrKey, {
          expiresIn: 31556926 // 1 year in seconds

        }, function (err, token) {
          res.json({
            success: true,
            token: "Bearer " + token
          });
        });
      } else {
        return res.status(400).json({
          passwordincorrect: "Password incorrect"
        });
      }
    });
  });
});
router.post('/delete', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  console.log(req.user._id);
  User.findByIdAndDelete(req.user._id, function (err, u) {
    console.log(u);
  });
  res.json({
    deleted: true,
    msg: 'authorized'
  });
});
module.exports = router;