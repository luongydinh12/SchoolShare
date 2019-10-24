import Express from 'express'
import Passport from 'passport'
import GroupChat from '../../models/GroupChat'
import User from '../../models/User'
import Profile from '../../models/Profile'
import Friend from '../../models/Friend'
const Router = Express.Router()
const auth = Passport.authenticate('jwt', { session: false })

Router.get('/', auth, (req, res) => {
    res.send('test')
})
module.exports=Router