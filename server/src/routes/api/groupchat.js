import Express from 'express'
import Passport from 'passport'
import JWT from 'jsonwebtoken'
import GroupChat from '../../models/GroupChat'
import GroupChatMessage from '../../models/GroupChatMessages'
import User from '../../models/User'
import Profile from '../../models/Profile'
import Friend from '../../models/Friend'
const Router = Express.Router()
const auth = Passport.authenticate('jwt', { session: false })

import io, { addSocketIdtoSession } from './socket.io'

io.of('/chat').on('connection', (socket) => {
    // const room = 'testroom'
    socket.on('join', (room) => {
        socket.join(room)
        console.log(`${socket.id} room: ${room}`)
    })
    socket.on('chatmsg', (message) => {
        console.log(`got message from ${socket.id}`, message)
        io.of('/chat').to(message.room).emit('chatmsg', message.msg) //socket.to and socket.in still won't work for some reason, check later x_x
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
            return chat.getMessages().then(messages => [chat, messages])
        }).then(([chat, messages]) => {
            console.log(messages)
            res.send({ chat: chat, messages: messages })
        })
        .catch((err) => {
            res.sendStatus(500)
            console.log(err)
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

Router.post('/message', (req, res) => {
    console.log(req.body)
    new GroupChatMessage({
        groupChat: '5dbf508e95a1d30c90faffad',
        text: req.body.message,
        poster: '5d8bdd3d9fcd191fa41afc35'
    }).save().then((msg) => {
        console.log(msg)
        res.send(msg)
    })
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