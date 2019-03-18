const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.db.secretOrKey;

passport.serializeUser((user, done) =>
  done(null, user.id));
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

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
      User.findOne({ googleId: profile.id }).then((u) => {
        if (u) {
          return done(null, u);
        }
        else {
          new User({
            name: profile.name.givenName + " " + profile.name.familyName,
            email: profile.emails[0].value,
            googleId: profile.id,
			avatar: profile._json.image.url.replace("?sz=50", "")
          }).save().then((u) => {
            //console.log("new user created " + newUser);
            return done(null, u);
          });
        }
      })
    }
  ));
  passport.use(new FacebookStrategy({
    clientID: keys.facebook.facebookClientId,
    clientSecret: keys.facebook.facebookClientSecret,
    callbackURL: "api/users/facebookcallback",
	profileFields: ['id', 'name', 'emails', 'photos']
  },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ facebookId: profile.id }).then((u) => {
        if (u) {
          return done(null, u);
        }
        else {
          new User({
            name: profile.name.givenName + " " + profile.name.familyName,
            email: profile.emails[0].value,
            facebookId: profile.id,
			avatar: profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg'
          }).save().then((u) => {
            //console.log("new user created " + newUser);
            return done(null, u);
          });
        }
      })
    }
  ));
};