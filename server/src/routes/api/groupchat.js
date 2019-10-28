import Express from 'express'
import Passport from 'passport'
import JWT from 'jsonwebtoken'
import GroupChat from '../../models/GroupChat'
import User from '../../models/User'
import Profile from '../../models/Profile'
import Friend from '../../models/Friend'
const Router = Express.Router()
const auth = Passport.authenticate('jwt', { session: false })

Router.get('/', auth, (req, res) => {
    res.send('test')
})
Router.get('/getChats', auth, (req, res) => {
    const tokenUser = JWT.decode(req.header("Authorization").split(' ')[1])
    Profile.findByUserId(tokenUser.id).then((profile) => {
       return GroupChat.getProfileChats(profile._id)
       .populate('owner')
       .populate('members')
       .exec()
    }).then((chats)=>{
        console.log(chats)
        res.send(chats)
    })
})
Router.post('/create', auth, (req, res) => {
    console.log(req.body)
    const tokenUser = JWT.decode(req.header("Authorization").split(' ')[1])
    Profile.findByUserId(tokenUser.id).then((profile) => {
        return new GroupChat({
            name: req.body.chatName,
            desc: req.body.chatDesc,
            owner: profile._id,
            members: req.body.checkedFriends
        }).save()
    }).then(
        (chat) => {
            console.log(chat)
        }
    )
})

module.exports = Router