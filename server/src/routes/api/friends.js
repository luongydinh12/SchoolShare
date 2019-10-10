import Express from 'express'
import Mongoose from 'mongoose'
import Passport from 'passport'
import JWT from 'jsonwebtoken'

import Profile from "../../models/Profile"
import Friend from '../../models/Friend'
import User from '../../models/User'

const Router = Express.Router()
const auth = Passport.authenticate('jwt', { session: false })

Router.get('/listFriends', auth,
    (req, res) => {
        const tokenUser = JWT.decode(req.header("Authorization").split(' ')[1])
        return Profile.findByUserId(tokenUser.id).then((profile) => {
            return profile.getFriends().then(friends => [profile._id, friends]) //pass along profile id
        }).then(([profileId, friends]) => {
            const list = friends.map((friend) => {//maps to only the one that isn't the logged in user
                if (friend.profileA.equals(profileId)) {
                    return {friend:friend.profileB, status:friend.status} //return { id: friend.profileB._id, handle: friend.profileB.handle }
                }
                return {friend:friend.profileA, status:friend.status}
            })
            return res.json(list)
        }).catch((err)=>{
            console.log(err)
            res.status(400)
            return res.send(`${err}`)
        })
    })

Router.get('/listFriendsOld', auth,
    (req, res) => {
        const tokenUser = JWT.decode(req.header("Authorization").split(' ')[1])
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

Router.get('/sendFriendRequest/:targetid', auth,
    (req, res) => {
        const targetid = req.params.targetid
        const tokenUser = JWT.decode(req.header("Authorization").split(' ')[1])
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


Router.post('/acceptOrRejectFriendRequest', auth,
    (req, res) => {
        const friendDocId = req.body.friendDocId
        const acceptStatus = req.body.accept
        console.log(friendDocId, acceptStatus)

        if (!acceptStatus || (acceptStatus != "approved" && acceptStatus != "reject")) {
            res.status(400)
            res.send(`Invalid accept status.`)
        }

        const tokenUser = JWT.decode(req.header("Authorization").split(' ')[1])

        var userProfileID
        Profile.findByUserId(tokenUser.id).then((profile) => {
            userProfileID = profile._id
            return Friend.findById(friendDocId)
        }).then((friend) => {
            if (!friend.profileB.equals(userProfileID)) throw Error(`${userProfileID} is not the recipient of request ${friendDocId}`)
            if (acceptStatus == "reject") {
                return friend.remove()
            }
            else {
                if (friend.status != 'pending') throw Error(`Request ${friendDocId} is not pending`)
                friend.status = acceptStatus
                return friend.save()
            }
        }).then((friend) => {
            return res.json({ friend: friend, status: acceptStatus })
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

module.exports = Router