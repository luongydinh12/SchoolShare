"use strict";

var passport = require("passport");

var JwtStrategy = require("passport-jwt").Strategy;

var ExtractJwt = require("passport-jwt").ExtractJwt;

var GoogleStrategy = require('passport-google-oauth20').Strategy;

var FacebookStrategy = require('passport-facebook').Strategy;

var mongoose = require("mongoose");

var User = mongoose.model("users");

var keys = require("../config/keys");

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.db.secretOrKey;
passport.serializeUser(function (user, done) {
  return done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = function (passport) {
  passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    User.findById(jwt_payload.id).then(function (user) {
      if (user) {
        return done(null, user);
      }

      return done(null, false);
    })["catch"](function (err) {
      return console.log(err);
    });
  }));
  passport.use(new GoogleStrategy({
    clientID: keys.google.googleClientId,
    clientSecret: keys.google.googleClientSecret,
    callbackURL: "api/users/googlecallback"
  }, function (accessToken, refreshToken, profile, done) {
    User.findOne({
      googleId: profile.id
    }).then(function (u) {
      if (u) {
        return done(null, u);
      } else {
        new User({
          name: profile.name.givenName + " " + profile.name.familyName,
          email: profile.emails[0].value,
          googleId: profile.id,
          avatar: profile._json.image.url.replace("?sz=50", "")
        }).save().then(function (u) {
          //console.log("new user created " + newUser);
          return done(null, u);
        });
      }
    });
  }));
  passport.use(new FacebookStrategy({
    clientID: keys.facebook.facebookClientId,
    clientSecret: keys.facebook.facebookClientSecret,
    callbackURL: "https://schoolshare.me/api/users/facebookcallback",
    profileFields: ['id', 'name', 'emails', 'photos']
  }, function (accessToken, refreshToken, profile, done) {
    User.findOne({
      facebookId: profile.id
    }).then(function (u) {
      if (u) {
        return done(null, u);
      } else {
        new User({
          name: profile.name.givenName + " " + profile.name.familyName,
          email: profile.emails[0].value,
          facebookId: profile.id,
          avatar: "https://avatars.io/facebook/" + profile.id
        }).save().then(function (u) {
          //console.log("new user created " + newUser);
          return done(null, u);
        });
      }
    });
  }));
};