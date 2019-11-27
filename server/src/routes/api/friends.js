import Express from 'express'
import Passport from 'passport'
import JWT from 'jsonwebtoken'

import Profile from "../../models/Profile"
import Friend from '../../models/Friend'

const Router = Express.Router()
const auth = Passport.authenticate('jwt', { session: false })

Router.get('/listFriends', auth,
    (req, res) => {
        const tokenUser = JWT.decode(req.header("Authorization").split(' ')[1])
        return Profile.findByUserId(tokenUser.id).then((profile) => {
            return profile.getFriends().then(friends => [profile._id, friends]) //pass along profile id
        }).then(([profileId, friends]) => {
            const list = friends.map((friend) => {//maps to only the one that isn't the logged in user
                var prof=friend.profileA.equals(profileId)?friend.profileB:friend.profileA
                prof={_id:prof.id,
                    avatar:prof.user.avatar,
                    handle:prof.handle,
                    description:prof.description}
                return { friend: prof, status: friend.status }
            })
            return res.json(list)
        }).catch((err) => {
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
        Profile.findByUserId(tokenUser.id).then((profileA) => {
            // console.log(`profileA: ${profileA}`)
            return Profile.findById(targetid).then((profileB)=>[profileA._id,profileB])
        }).then(([profileAId, profileB]) => {
            if(!profileB) throw Error(`${targetid} does not exist.`)
            // console.log(`profileAID: ${profileAId} profileB:${profileB}`)
            return Friend.getFriendDocument(profileAId, targetid).then(friend => [profileAId, friend])
        }).then(([profileAId, friend]) => {
            // console.log(`profileAId: ${profileAId} friend: ${friend}`)
            if (friend) throw Error(`A friend record with profile IDs ${profileAId} and ${targetid} exists already. Record: ${friend}`)
            if (!friend) {
                return new Friend({
                    profileA: profileAId,
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

        if (acceptStatus==null || (acceptStatus != "true" && acceptStatus != "false")) {
            res.status(400)
            res.send(`Invalid accept status.`)
        }

        const tokenUser = JWT.decode(req.header("Authorization").split(' ')[1])

        Profile.findByUserId(tokenUser.id).then((profile) => {
            return Friend.findById(friendDocId).then(friend => [profile._id, friend])
        }).then(([profileAId, friend]) => {
            if (!friend.profileB.equals(profileAId)) throw Error(`${profileAId} is not the recipient of request ${friendDocId}`)
            if (acceptStatus == "false") {
                return friend.remove()
            }
            else {
                if (friend.status != 'pending') throw Error(`Request ${friendDocId} is not pending`)
                friend.status = "approved"
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

Router.post('/removeFriend',auth,
    (req,res)=>{
        const friendDocId = req.body.friendDocId
        const tokenUser = JWT.decode(req.header("Authorization").split(' ')[1])
        Profile.findByUserId(tokenUser.id).then((profile)=>{
            return Friend.findById(friendDocId).then(friend=>[profile._id,friend])
        }).then(([profileId,friend])=>{
            if(friend.profileA.equals(profileId)||friend.profileB.equals(profileId)){
                return friend.remove()
            }
        }).then((friend)=>{
            return res.json({friend:friend,removed:true})
        }).catch((err)=>{
            console.log(`${err}`)
            res.status(400)
            return res.send(`${err}`)
        })
    }
)

Router.get('/getFriend/:targetid', auth,
    (req, res) => {
        const targetid = req.params.targetid
        const tokenUser = JWT.decode(req.header("Authorization").split(' ')[1])
        Profile.findByUserId(tokenUser.id).then((profile)=>{
            if(profile._id==targetid) return "self"
            return Friend.getFriendDocument(profile._id,targetid).then((friend)=>[profile._id,friend])
        }).then(([profileid, friend])=>{
            if(!friend) res.json(0) //react: state.friend=null is used before api call to render null button
            res.json({...friend.toObject(),request:(friend.profileB.equals(profileid))})
        })
    })



// Router.post('/createFriendRequest',
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
//  }) //DELETE THIS

// Router.post('/deleteFriendRequest',
//   (req, res) => {
//     const a = req.body.friendDocId
//     console.log(a)
//     Friend.findById(a).then((friend) => {
//       console.log(`remove ${friend}`)
//       return friend.remove()
//     }).then((friend) => {
//       return res.json({ friend: friend })
//     })
//   }) //DELETE THIS

module.exports = Router