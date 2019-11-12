import Express from 'express'
import Passport from 'passport'
import JWT from 'jsonwebtoken'
import GroupChat from '../../models/GroupChat'
import GroupChatMessages from '../../models/GroupChatMessages'
import User from '../../models/User'
import Profile from '../../models/Profile'
import Friend from '../../models/Friend'
const Router = Express.Router()
const auth = Passport.authenticate('jwt', { session: false })

import io, { addSocketIdtoSession } from './socket.io'
io.of('/chat').on('connection', (socket) => {
    const room='testroom'
    socket.on('join', (num) => {
        console.log(`joined room           ${socket.id}`)
        socket.join(room)
        //io.sockets.in(room).emit('chatmsg', 'After joined')
    })
    socket.on('chatmsg', (message) => {
        console.log(`got message from ${socket.id}`, message)
        socket.emit('chatmsg','socketemit')
        //io.emit('chatmsg','ioemit')
        //io.to(room).emit('ioroomemit')
        //io.sockets.in('testroom').emit('chatmsg','socketroomemit')
        socket.to(room).emit('chatmsg',"tes")
        //var room2 = io.sockets.adapter.rooms[room];
        //socket.broadcast.emit('chatmsg', 'room2')
    })
})

Router.get('/getChats', auth, (req, res) => {
    const tokenUser = JWT.decode(req.header("Authorization").split(' ')[1])
    Profile.findByUserId(tokenUser.id).then((profile) => {
        return GroupChat.getProfileChats(profile._id)
            .populate('owner')
            .populate('members')
            .exec()
    }).then((chats) => {
        // console.log(`chats: ${chats}`)
        res.send(chats)
    })
})

Router.get('/chat/:chatId', auth, (req, res) => {
    const chatId = req.params.chatId
    GroupChat.findById(chatId)
        .populate('owner')
        .populate('members')
        .then((chat) => {
            res.send(chat)
        }).catch((err) => {
            res.sendStatus(500)
        })
})

Router.post('/create', auth, (req, res) => {
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
            res.send(chat)
        }
    )
})

Router.post('/submit')

Router.post('/leaveOrDelete', auth, (req, res) => {
    const tokenUser = JWT.decode(req.header("Authorization").split(' ')[1])
    Profile.findById(req.body.profileId)
        .then((prof) => {
            if (!prof.user.equals(tokenUser.id)) throw Error('wrong profileid')
            return GroupChat.findById(req.body.chat)
        })
        .then((chat) => {//if chat owner, delete
            if (chat.owner.equals(req.body.profileId)) {
                return GroupChat.remove({ _id: chat._id })
            }
            else {//else remove from members list
                return GroupChat.members.pull(req.body.profileId)
            }
        }).then((c) => {
            res.send(c)
        }).catch(
            (err) => {
                console.log(err)
                res.status(500)
                res.send(err)
            }
        )
})

export default Router