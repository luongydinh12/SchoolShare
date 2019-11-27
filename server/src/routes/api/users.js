const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const gravatar = require('gravatar');
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User")
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

import io, {addSocketIdtoSession} from './socket.io'

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
      //Create Empty Profile:
      

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
  return res.json({ test: true })
});
router.get("/google", addSocketIdtoSession,
  passport.authenticate('google', { scope: ["profile", "email"] })
);

router.get("/facebook", addSocketIdtoSession,
  passport.authenticate('facebook', { scope: ["email"]})
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
    const token = jwt.sign(
      payload,
      keys.db.secretOrKey,
      {
        expiresIn: 31556926 // 1 year in seconds
      });
    io.in(req.session.socketId).emit('google', "Bearer " + token);
    return res.end(`<script>
    window.close();
</script>`)
  }
);

router.get(
  "/facebookcallback",
  passport.authenticate("facebook", { scope: ["email"] }),
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
    const token = jwt.sign(
      payload,
      keys.db.secretOrKey,
      {
        expiresIn: 31556926 // 1 year in seconds
      });
    io.in(req.session.socketId).emit('facebook', "Bearer " + token);
    return res.end(`<script>
    window.close();
</script>`)
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
              token: "Bearer " + token,
              userId: user.id
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

router.post('/delete', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log(req.user._id);
    User.findByIdAndDelete(req.user._id, (err, u) => {
      console.log(u)
    })
    res.json({
      deleted: true,
      msg: 'authorized'
    })
  });

  router.get('/listAllUsers', passport.authenticate('jwt',{session:false}),
    (req,res)=>{
      User.find((err,users)=>{
        if(err) return console.log(err)
        const uList=users.map((user)=>{
          return {
            id:user._id,
            name:user.name
          }
        })
        res.json(uList)
      })
    }
  )

  router.get('/avatar', 
    (req,res)=>{
      const userId = req.query.user || undefined;

      User.findById(userId, (err, u) => {
        //console.log(u)
        res.json({
          avatar: u.avatar
        })
      })
    }
  )  
module.exports = router;