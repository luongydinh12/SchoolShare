const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../../config/keys");
const gravatar = require('gravatar');
// Load input validation
const validateRegisterInput = require("../../../validation/register");
const validateLoginInput = require("../../../validation/login");
// Load User model
const User = require("../../../models/User");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

const http=require('http').Server(app);
const io=require('socket.io')(http);
app.set('io',io);

const addSocketIdtoSession = (req, res, next) => {
  req.session.socketId = req.query.socketId;
  next();
}

io.on('connection',function(socket){
  console.log("socket.io connected",socket.id);
  socket.on('disconnect',function(){
    console.log("socket.io disconnected",socket.id);
  });
  socket.on('example_message',function(msg){
    console.log('message:\t'+msg+"\t id:\t"+socket.id);
    // socket.emit('example_response','response msg');
  })
})
io.listen(5050);

//Get (test)
router.get('/', (req, res) => {
  res.send('Users');
});

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm' // Default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});
router.post("/test", (req, res) => {
  console.log("test");
});
router.get("/google", addSocketIdtoSession,
  passport.authenticate('google', { scope: ["profile", "email"] })
  );

router.get(
  "/googlecallback",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  function (req, res) { 
    const u = req.user;
    const payload = {
      id: u.id,
      name: u.name,
      email: u.email,
      date: u.date,
      avatar: u.avatar,
      description: u.description
    };
    const token= jwt.sign(
      payload,
      keys.db.secretOrKey,
      {
        expiresIn: 31556926 // 1 year in seconds
      }    );
    const io=app.get('io');
    //console.log("token: ",token);
    io.in(req.session.socketId).emit('google',"Bearer "+token);
    return res.status(200).json({success:true});
  }
);

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          date: user.date,
          //googleId: user.googleId,
          //facebookId: user.facebookId,
          avatar: user.avatar,
          description: user.description
        };
        // Sign token
        jwt.sign(
          payload,
          keys.db.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});


module.exports = router;