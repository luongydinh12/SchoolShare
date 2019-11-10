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

let onlineList = {}
io.of('/chat').on('connection', (socket) => {
    // const room = 'testroom'
    //dict for storing online members
    socket.on('join', (msg) => {
        socket.join(msg.room)
        if (!onlineList[msg.room]) {
            onlineList[msg.room] = {}
        }
        onlineList[msg.room][socket.id] = msg.prof

        console.log(`profile ${msg.prof} joined room ${msg.room} wtih socketid ${socket.id} `)
        io.of('/chat').to(msg.room).emit('onlinelist', onlineList[msg.room])
    })
    socket.on('chatmsg', (message) => {
        console.log(`got message from ${socket.id}`, message.msg.text)
        io.of('/chat').to(message.room).emit('chatmsg', message.msg) //socket.to and socket.in still won't work for some reason, check later x_x

        new GroupChatMessage({
            groupChat: message.room,
            text: message.msg.text,
            poster: message.msg.poster._id
        }).save()
    })
    socket.on('leave', (msg) => {
        console.log(`${socket.id} leaving room  msg: ${JSON.stringify(msg)}`)
        delete onlineList[msg.room][socket.id]
        console.log(onlineList)
    })
    socket.on('disconnect', () => {
        for (var room in onlineList) {
            for (var socketid in onlineList[room]) {
                console.log(socketid)
                if (socketid === socket.id) {
                    delete onlineList[room][socketid]
                }
            }
        }
        console.log(`${socket.id} disconnected: onlineList 
            `, onlineList)
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

Router.post('/addUsersToChat', auth, (req, res) => {
    const tokenUser = JWT.decode(req.header("Authorization").split(' ')[1])
    console.log(req.body)
    Profile.findByUserId(tokenUser.id)
        .then((prof) => {
            const profileId = prof._id
            return GroupChat.findOneAndUpdate(
                {
                    $and: [
                        { _id: req.body.chat },
                        {
                            $or: [
                                { owner: profileId },
                                {
                                    $and: [{ membersCanAdd: true }, {
                                        members: { '$in': [profileId] }
                                    }]
                                }]
                        }]
                },
                {
                    $addToSet: { members: { $each: req.body.users } }
                }
            )
        }).then((chat) => {
            console.log(chat)
            res.sendStatus(200)
        })
})


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