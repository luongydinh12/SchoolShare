const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Profile = require("../../../models/Group");

router.get('/test', (req, res) => res.json({ msg: 'in groups.js' }));
router.get('/testauth',passport.authenticate('jwt', { session: false }),
(req, res)=> res.json({
    msg: 'authorized'
}));

module.exports = router;
