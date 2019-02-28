const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const passport = require("passport");
var GoogleStrategy = require('passport-google-oauth20').Strategy;

const users = require("../server/routes/api/users");

const app = express();

const keys=require("../config/keys");

//Middleware
app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
app.use(bodyParser.json());
app.use(cors());

//DB Config
// const db = require("../config/keys").mongoURI;
const db = keys.mongoURI;

//Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Post
const posts = require('./routes/api/posts');
app.use('/api/posts',posts);


passport.use(new GoogleStrategy({
  clientID: keys.googleClientId,
  clientSecret: keys.googleClientSecret,
  callbackURL: "http://localhost:3000"
},
function(accessToken, refreshToken, profile, cb){
  console.log("passport callback function fired");

  users.findOrCreate({googleId:profile.id},function(err,user){
    return cb(err, user);
  })
})); 

// Passport middleware
app.use(passport.initialize());
// Passport config
require("../config/passport")(passport);
// Routes

app.use("/api/users", users);



//Heroku, might need to change this
const port = process.env.PORT || 5000;
app.listen(port,() => console.log( `Server started on port ${port}`));
