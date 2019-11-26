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

let chatOnlineList = {}     //dict for storing online members
let voiceOnlineList = {}

io.of('/chat').on('connection', (socket) => {
    socket.on('join', (msg) => {
        socket.join(msg.room)
        if (!chatOnlineList[msg.room]) {
            chatOnlineList[msg.room] = {}
        }
        chatOnlineList[msg.room][socket.id] = msg.prof

        console.log(`profile ${msg.prof} joined room ${msg.room} wtih socketid ${socket.id} `)
        sendOnlineListUpdate(msg.room)
    })
    socket.on('chatmsg', (message) => {
        console.log(`got message from ${socket.id}`, message.msg.text)
        io.of('/chat').to(message.room).emit('chatmsg', message.msg)

        new GroupChatMessage({
            groupChat: message.room,
            text: message.msg.text,
            poster: message.msg.poster._id
        }).save()
    })
    socket.on('leave', (msg) => {
        console.log(`${socket.id} leaving room  msg: ${JSON.stringify(msg)}`)
        if (chatOnlineList[msg.room]) delete chatOnlineList[msg.room][socket.id] //on server update, client may still attempt to leave a room that doesn't exist
        console.log(chatOnlineList)
        sendOnlineListUpdate(msg.room)
    })
    socket.on('disconnect', () => {
        for (var room in chatOnlineList) {
            for (var socketid in chatOnlineList[room]) {
                if (socketid === socket.id) {
                    delete chatOnlineList[room][socketid]
                    sendOnlineListUpdate(room)
                }
            }
        }
        console.log(`${socket.id} disconnected: onlineList 
            `, chatOnlineList)
    })

    const sendOnlineListUpdate = (room) => {
        io.of('/chat').to(room).emit('onlinelist', Object.keys(chatOnlineList[room]).map((key) => {
            return chatOnlineList[room][key]
        }))
    }
})

io.of('/voiceChat').on('connection', (socket) => {
    socket.emit("connect", "voice connected")
    console.log(`voice connected: ${socket.id}`)
    socket.on('join', (msg) => {
        console.log('join', msg.room)
        socket.join(msg.room)
        if (!voiceOnlineList[msg.room]) {
            voiceOnlineList[msg.room] = {}
        }
        socket.emit('onlinelist', voiceOnlineList[msg.room])
        voiceOnlineList[msg.room][socket.id] = { profile: msg.profile }
        console.log(`socket ${socket.id} joined room ${msg.room} `)
        socket.to(msg.room).emit('userConnect', { socketId: socket.id, profile: voiceOnlineList[msg.room][socket.id] })
    })
    socket.on('disconnect', () => {
        for (var room in voiceOnlineList) {
            for (var socketid in voiceOnlineList[room]) {
                if (socketid === socket.id) {
                    delete voiceOnlineList[room][socketid]
                    io.of('/voiceChat').to(room).emit('userDisconnect', socket.id)
                }
            }
        }
        console.log(`${socket.id} disconnected: voiceOnlineList 
            `, voiceOnlineList)
    })
    socket.on('relayMsg', (data) => {
        const { recipient, sender, room, msgType, msg } = data
        console.log(data)
        io.of('/voiceChat').to(recipient).emit('relayMsg', { sender: sender, msgType: msgType, msg: msg })
    })
    const sendOnlineList = (room) => {
        console.log('send online list:', voiceOnlineList)
        io.of('/voiceChat').to(room).emit('onlinelist',
            voiceOnlineList[room]
        )
    }
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