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
      return User.findOneAndRemove({ _id: req.user.id })
    }).then(() =>
      res.json({ success: true })
    ).catch((err) => {
      console.log(`${err}`)
      res.status(400)
      return res.send(`${err}`)
    })
  })


router.get('/listAllProfiles', auth,
  (req, res) => {
    Profile.find().then((profiles) => {
      const profList = profiles.map((profile) => {
        return {
          id: profile._id,
          handle: profile.handle
        }
      })
      res.json(profList)
    }).catch((err) => {
      console.log(err)
      res.sendStatus(500)
    })
  })

router.get('/sendFriendRequest/:targetid', auth,
  (req, res) => {
    const targetid = req.params.targetid
    const tokenUser = jwt.decode(req.header("Authorization").split(' ')[1])
    var userProfileID
    Profile.findByUserId(tokenUser.id).then((profileA) => {
      userProfileID = profileA._id
      return Profile.findByUserId(targetid)
    }).then((profileB) => {
      return Friend.getFriendDocument(userProfileID, targetid)
    })
      .then((friend) => {
        console.log(friend)
        if (friend) throw Error(`A friend record with profile IDs ${userProfileID} and ${targetid} exists already. Record: ${friend}`)
        if (!friend) {
          return new Friend({
            profileA: userProfileID,
            profileB: targetid,
            status: 'pending'
          }).save()
        }
      }).then((friend) => {
        return res.json({ friend: friend })
      }).catch((err) => {
        console.log(`${err}`)
        res.status(400)
        return res.send(`${err}`)
      })
  }
)

router.post('/acceptOrRejectFriendRequest', auth,
  (req, res) => {
    const friendDocId = req.body.friendDocId
    const acceptStatus = req.body.accept
    console.log(friendDocId, acceptStatus)

    if (!acceptStatus || (acceptStatus != "approved" && acceptStatus != "reject")) {
      res.status(400)
      res.send(`Invalid accept status.`)
    }

    const tokenUser = jwt.decode(req.header("Authorization").split(' ')[1])

    var userProfileID
    Profile.findByUserId(tokenUser.id).then((profile) => {
      userProfileID = profile._id
      return Friend.findById(friendDocId)
    }).then((friend) => {
      if (!friend.profileB.equals(userProfileID)) throw Error(`${userProfileID} is not the recipient of request ${friendDocId}`)
      if (friend.status != 'pending') throw Error(`Request ${friendDocId} is not pending`)
      if (acceptStatus == "reject") {
        return friend.remove()
      }
      else {
        friend.status = acceptStatus
        return friend.save()
      }
    }).then((friend) => {
      return res.json(friend)
    }).catch((err) => {
      console.log(`${err}`)
      res.status(400)
      return res.send(`${err}`)
    })
  }
)

// router.post('/createFriendRequest',
//   (req, res) => {
//     const a = req.body.a
//     const b = req.body.b
//     console.log(`a: ${a} b: ${b}`)
//     new Friend({
//       profileA: a,
//       profileB: b,
//       status: 'pending'
//     }).save().then((friend) => {
//       console.log(`########friend created ${friend}`)
//       res.json(friend)
//     })
//   }) //DELETE THIS

// router.post('/deleteFriendRequest',
//   (req, res) => {
//     const a = req.body.friendDocId
//     Friend.findById(a).then((friend) => {
//       console.log(`remove ${friend}`)
//       return friend.remove()
//     }).then((friend) => {
//       return res.json({ friend: friend })
//     })
//   }) //DELETE THIS
  
router.get('/listFriends', auth,
  (req, res) => {
    const tokenUser = jwt.decode(req.header("Authorization").split(' ')[1])
    Profile.findByUserId(tokenUser.id).then((profile) => {
      return profile.getFriends()
    }).then((friends) => {
      return res.json(friends)
    }).catch((err) => {
      console.log(`${err}`)
      res.status(400)
      return res.send(`${err}`)
    })
  })


router.get('/findUserProfile', auth,
  (req, res) => {
    const tokenUser = jwt.decode(req.header("Authorization").split(' ')[1])
    Profile.findByUserId(tokenUser.id).then((profile) => {
      res.json(profile)
    })
  })


module.exports = router;
