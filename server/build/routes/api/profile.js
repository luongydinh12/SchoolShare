"use strict";

var express = require('express');

var router = express.Router();

var mongoose = require('mongoose');

var passport = require('passport'); // Load Validation


var validateProfileInput = require('../../validation/profile');

var validateClassInput = require('../../validation/class'); // Load Profile Model


var Profile = require('../../models/Profile'); // Load User Model


var User = require('../../models/User');

var auth = passport.authenticate('jwt', {
  session: false
}); // @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public

router.get('/test', function (req, res) {
  return res.json({
    msg: 'Profile Works'
  });
}); // @route   GET api/profile
// @desc    Get current users profile
// @access  Private

router.get('/', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  var errors = {};
  Profile.findOne({
    user: req.user.id
  }).populate('user', ['name', 'avatar']).then(function (profile) {
    if (!profile) {
      errors.noprofile = 'There is no profile for this user';
      return res.status(404).json(errors);
    }

    res.json(profile);
  })["catch"](function (err) {
    return res.status(404).json(err);
  });
}); // @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public

router.get('/handle/:handle', function (req, res) {
  var errors = {};
  Profile.findOne({
    handle: req.params.handle
  }).populate('user', ['name', 'avatar']).then(function (profile) {
    if (!profile) {
      errors.noprofile = 'There is no profile for this user';
      res.status(404).json(errors);
    }

    res.json(profile);
  })["catch"](function (err) {
    return res.status(404).json(err);
  });
}); // @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public

router.get('/all', function (req, res) {
  var errors = {};
  Profile.find().populate('user', ['name', 'avatar']).then(function (profiles) {
    if (!profiles) {
      errors.noprofile = 'There are no profiles';
      return res.status(404).json(errors);
    }

    res.json(profiles);
  })["catch"](function (err) {
    return res.status(404).json({
      profile: 'There are no profiles'
    });
  });
}); // @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get('/user/:user_id', function (req, res) {
  var errors = {};
  Profile.findOne({
    user: req.params.user_id
  }).populate('user', ['name', 'avatar']).then(function (profile) {
    if (!profile) {
      errors.noprofile = 'There is no profile for this user';
      res.status(404).json(errors);
    }

    res.json(profile);
  })["catch"](function (err) {
    return res.status(404).json({
      profile: 'There is no profile for this user'
    });
  });
}); // @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private

router.post('/', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  var _validateProfileInput = validateProfileInput(req.body),
      errors = _validateProfileInput.errors,
      isValid = _validateProfileInput.isValid; // Check Validation


  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  } // Get fields


  var profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.description) profileFields.description = req.body.description;
  var userFields = {};
  if (req.body.avatar) userFields.avatar = req.body.avatar; // ADD THIS

  if (req.body.name) userFields.name = req.body.name; //if (req.body.email) userFields.email = req.body.email;

  /*console.log(req.user.id);
  console.log("AVATAR HERE: ");
  console.log(req.user.email);*/

  Profile.findOne({
    user: req.user.id
  }).then(function (profile) {
    if (profile) {
      // Update
      Profile.findOneAndUpdate({
        user: req.user.id
      }, {
        $set: profileFields
      }, {
        "new": true
      }).then(function (profile) {
        return res.json(profile);
      });
      User.findOneAndUpdate({
        _id: req.user.id
      }, {
        $set: userFields
      }, {
        "new": true
      }).then(function (user) {
        return res.json(user);
      });
      /* User.findOneAndUpdate(
         { _id: req.user.id },
         { avatar: avatarhere, name: namehere, email: emailhere },
         { new: true }
       ).then(user => res.json(user));*/
    } else {
      // Create
      // Check if handle exists
      Profile.findOne({
        handle: profileFields.handle
      }).then(function (profile) {
        if (profile) {
          errors.handle = 'That handle already exists';
          res.status(400).json(errors);
        } // Save Profile


        new Profile(profileFields).save().then(function (profile) {
          return res.json(profile);
        });
      });
    }
  });
}); // @route   POST api/profile/class
// @desc    Add class to profile
// @access  Private

router.post('/class', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  var _validateClassInput = validateClassInput(req.body),
      errors = _validateClassInput.errors,
      isValid = _validateClassInput.isValid; // Check Validation


  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  Profile.findOne({
    user: req.user.id
  }).then(function (profile) {
    var newExp = {
      title: req.body.title,
      term: req.body.term,
      room: req.body.room,
      current: req.body.current,
      description: req.body.description
    }; // Add to class array

    profile["class"].unshift(newExp);
    profile.save().then(function (profile) {
      return res.json(profile);
    });
  });
}); // @route   DELETE api/profile/class/:exp_id
// @desc    Delete class from profile
// @access  Private

router["delete"]('/class/:exp_id', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  Profile.findOne({
    user: req.user.id
  }).then(function (profile) {
    // Get remove index
    var removeIndex = profile["class"].map(function (item) {
      return item.id;
    }).indexOf(req.params.exp_id); // Splice out of array

    profile["class"].splice(removeIndex, 1); // Save

    profile.save().then(function (profile) {
      return res.json(profile);
    });
  })["catch"](function (err) {
    return res.status(404).json(err);
  });
}); // @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private

router["delete"]('/', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  Profile.findOneAndRemove({
    user: req.user.id
  }).then(function () {
    User.findOneAndRemove({
      _id: req.user.id
    }).then(function () {
      return res.json({
        success: true
      });
    });
  });
});
router.get('/listAllProfiles', auth, function (req, res) {
  Profile.find(function (err, profiles) {
    if (err) {
      console.log(err);
      res.status(500);
    }

    var profList = profiles.map(function (profile) {
      return {
        id: profile._id,
        handle: profile.handle
      };
    });
    res.json(profList);
  });
});
module.exports = router;