const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.db.secretOrKey;

// passport.serializeUser((user,done)=>
// done(null, user.googleId));

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
  passport.use(new GoogleStrategy({
    clientID: keys.google.googleClientId,
    clientSecret: keys.google.googleClientSecret,
    callbackURL: "api/users/googlecallback"
  },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then((user) => {
        if (user) {
            console.log("current user"+user);
            var user={
              user: user,
              token:accessToken
            }
            return done(null, user);
        }
        else {
          new User({
            name: profile.name.givenName + " " + profile.name.familyName,
            email: profile.emails[0].value,
            googleId: profile.id
          }).save().then((newUser) => {
            console.log("new user created " + newUser);
          });
        }
      })

    }
  ));
};