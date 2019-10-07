const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require("jsonwebtoken");

// Load Validation
const validateProfileInput = require('../../validation/profile')
const validateClassInput = require('../../validation/class');


// Load Profile Model
import Profile from "../../models/Profile";
import Friend from '../../models/Friend'
// Load User Model
const User = require('../../models/User');

const auth = passport.authenticate('jwt', { session: false })

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Profile Works' }));

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);
// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public

router.get('/handle/:handle', (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});
// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: 'There are no profiles' }));
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: 'There is no profile for this user' })
    );
});

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.description) profileFields.description = req.body.description;

    const userFields = {};
    if (req.body.avatar) userFields.avatar = req.body.avatar; // ADD THIS
    if (req.body.name) userFields.name = req.body.name;
    //if (req.body.email) userFields.email = req.body.email;

    /*console.log(req.user.id);
    console.log("AVATAR HERE: ");
    console.log(req.user.email);*/
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
        User.findOneAndUpdate(
          { _id: req.user.id },
          { $set: userFields },
          { new: true }
        ).then(user => res.json(user));
        /* User.findOneAndUpdate(
           { _id: req.user.id },
           { avatar: avatarhere, name: namehere, email: emailhere },
           { new: true }
         ).then(user => res.json(user));*/

      } else {
        // Create
        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = 'That handle already exists';
            res.status(400).json(errors);
          }
          // Save Profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// @route   POST api/profile/class
// @desc    Add class to profile
// @access  Private
router.post(
  '/class',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateClassInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        term: req.body.term,
        room: req.body.room,
        current: req.body.current,
        description: req.body.description
      };

      // Add to class array
      profile.class.unshift(newExp);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route   DELETE api/profile/class/:exp_id
// @desc    Delete class from profile
// @access  Private
router.delete(
  '/class/:exp_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.class
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        // Splice out of array
        profile.class.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);


router.get('/listAllProfiles', auth,
  (req, res) => {
    Profile.find((err, profiles) => {
      if (err) {
        console.log(err)
        res.status(500)
      }
      const profList = profiles.map((profile) => {
        return {
          id: profile._id,
          handle: profile.handle
        }
      })
      res.json(profList)
    })
  })

router.get('/sendFriendRequest/:targetid', auth, //targetID is target's profile id
  (req, res) => {
    const targetid = req.params.targetid
    const tokenUser = jwt.decode(req.header("Authorization").split(' ')[1])
    User.findById(tokenUser.id).then((user) => {
      user.getUserProfile().then((profileA) => {
        if (!profileA) return res.sendStatus(403)
        else {
          Profile.findById(targetid).exec().then((profileB) => {
            if (!profileB) return res.sendStatus(403)
            else {
              Friend.getFriendDocument(profileA._id, profileB._id).exec().then((friend) => {
                if (!friend) {
                  const f = new Friend({
                    profileA: profileA._id,
                    profileB: targetid,
                    status: 'pending'
                  }).save().then((friend) => {
                    return res.json({ profileA: profileA, profileB: profileB, friend: friend })
                  })//save().then()
                }
                else {
                  res.json({ err: "Request already sent", friend: friend })
                }
              })
            }
          })
        }
      })
    })
  }
)

router.get('/acceptFriendRequest/:friendDocId', auth, 
  (req, res) => {
    const friendDocId = req.params.friendDocId
    const tokenUser = jwt.decode(req.header("Authorization").split(' ')[1])
    Profile.findByUserId(tokenUser.id).then((prof)=>{
      Friend.findById(friendDocId).exec().then((friend)=>{
        if(friend.profileB!=prof._id||friend.status!='pending') return res.sendStatus(403)
        friend.status='approved'
        friend.save().then((friend)=>{
          return res.json(friend)
        })
      })
    })
  }
)

router.get('/listFriends', auth,
  (req, res) => {
    const tokenUser = jwt.decode(req.header("Authorization").split(' ')[1])
    User.findById(tokenUser.id).exec().then((user) => {
      user.getUserProfile().then((profile) => {
        profile.getFriends().then((friends) => {
          res.json(friends)
        })
      })
    })
  })//user.findbyid


router.get('/findUserProfile', auth,
  (req, res) => {
    const tokenUser = jwt.decode(req.header("Authorization").split(' ')[1])
    Profile.findByUserId(tokenUser.id).then((profile)=>{
      res.json(profile)
    })
  })

router.get('/friendstatictest', auth, (req, res) => {
  Friend.getFriendDocument().exec().then((friend) => {
    res.json(friend)
  })
})
module.exports = router;
