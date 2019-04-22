const express = require('express');
// model
const Group = require("../../../models/Group");
const GroupCategory = require("../../../models/GroupCategory");
const Message = require("../../../models/Messages");
const User = require("../../../models/User");
const router = express.Router();

//Get Posts
router.get('/', (req, res)=>{
  res.send('posts');
});


// @route POST api/posts/creategroupcat
// @desc Create group category
// @access Users
// @returns String
router.post('/createcategory', (req, res) => {
  const { name } = req.body
  GroupCategory.findOne({ name: name })
  .then(data => {
    if (!data) {
      const newGroupCat = new GroupCategory({
        name: name
      })
      newGroupCat
      .save()
      .then(data => {
        res.send({
          success: 'Group category created successfully'
        })
      })
      .catch(err =>  console.log(err))
    } else {
      res
      .status(400)
      .send({
        error: 'Group category already exists'
      })
    }
  })
  .catch(err =>  console.log(err))
})

// @route POST api/posts/creategroup
// @desc Create group
// @access Users
// @returns String
router.post('/creategroup', (req, res) => {
  console.log(req.body);
  const { name, desc, createdBy, catId } = req.body
  let obj = {
    groupId: ''
  }
  Group.findOne({ name: name })
  .then(data => {
    if (!data) {
      const newGroup = new Group({
        name: name,
        desc: desc,
        createdBy: createdBy,
        catId: catId
      })
      newGroup
      .save()
      .then(data => {
        res.send({
          success: 'Group created successfully'
        })
        obj.groupId = data._id 
        GroupCategory.findById(catId)
        .then(data => {
          data.groupId.push(obj.groupId)
          data.save()
        })
        .catch(err =>  console.log(err))
      })
      .catch(err =>  console.log(err))
    } else {
      res
      .status(400)
      .send({
        error: 'Group already exists'
      })
    }
  })
  .catch(err =>  console.log(err))
}) 

// @route GET api/posts/getallgroupcat
// @desc list group categories from latest to the oldest
// @access Users
// @returns Array of Object(s)
router.get('/getallcategories', (req, res) => {
  const limit = req.query.limit || 0
  GroupCategory.find()
  .sort({ _id: -1})
  .limit(Number(limit))
  .then(data => {
    res.send({
      data: data
    })
  })
  .catch(err =>  console.log(err))
})

// @route GET api/posts/getallgroup
// @desc list group from latest to the oldest 
// @access Users
// @returns Array of Object(s)
router.get('/getallgroups', (req, res) => {
  const limit = req.query.limit || 0
  Group.find({catId : req.query.catId})
  .sort({ _id: -1})
  .limit(Number(limit))
  .then(data => {
    res.send({
      data: data
    })
  })
  .catch(err =>  console.log(err))
})

// @route GET api/posts/getGroupsByCategoryName
// @desc list groups from latest to the oldest, by category name
// @access Users
// @returns Array of Object(s)
router.get('/getGroupsByCategoryName', (req, res) => {
  const limit = req.query.limit || 0
  //const _catId=GroupCategory.findOne({name:req.query.cat})
  GroupCategory.findOne({name:req.query.cat}).then(cat=>{
    Group.find({catId : cat._id})
    .sort({ _id: -1})
    .limit(Number(limit))
    .then(data => {
      res.send({
        data: data
      })
    })
    .catch(err =>  console.log(err))
  })
})


// @route GET api/posts/searchgroups
// @desc list matching groups from newest to oldest
// @access Users
// @returns Array of Object(s)
router.get('/searchgroups', (req, res) => {
  const q=req.query.query;
  Group.find({
    name: new RegExp(q,'i')
  })
  .sort({date:-1})
  .then(data=>{
    res.send(data);
  })
  .catch(err =>  console.log(err));
})

// @route GET api/posts/getmygroups 
// @desc list group that a user is subscribed to
// @access Users
// @returns Array of Object(s)
router.get('/getmygroups', (req, res) => {
  const user = req.query.user || undefined;
  if(!user) return console.error('No user specified');

  let myGroups = [];
  Group.find()
  .then(data => {
    data.map(g=>{
      // console.log({g})
      if(g.members.indexOf(user) != -1) {
        myGroups.push(g._id);
      }
    });
    Group.find({ _id: { $in: myGroups }}).then(data => {
      res.send({data});
    }).catch(err =>  console.log(err))

  })
  .catch(err =>  console.log(err))
})  

// @route GET api/posts/getgroup
// @desc get group categoriy and popilate all the groups in them in details from latest to the oldest
// @access Users
// @returns Array of Object(s)
router.get('/getgroup', (req, res) => {
  const groupId  = req.query.id
  Group.findById(groupId)
  .populate('createdBy')
  .populate('messageId')
  .populate('catId')
  .then(data => {
    res.send({
      data: data
    })
  })
  .catch(err =>  console.log(err))
})

// @route GET api/posts/joingroup
// @desc get group and add new member to it
// @access Users
// @returns Array of Object(s)
router.get('/joingroup', (req, res) => {
  const groupId  = req.query.id
  const user  = req.query.user
  const name  = req.query.name
  Group.findById(groupId)
  
  .then(data => {
      data.members.push(user)
      data.membersName.push(name)
      data.save()
      .then(data => {
        res.send({
          success: 'User successfully joined',
          data: data
        })
      })
      .catch(err =>  console.log(err))
  })
  .catch(err =>  console.log(err))
})

// @route GET api/posts/leaveGroup
// @desc get group and remove a memeber from it
// @access Users
// @returns Array of Object(s)
router.get('/leaveGroup', (req, res) => {
  const groupId  = req.query.id
  const user  = req.query.user
  const name  = req.query.name
  Group.findById(groupId)
  
  .then(data => {
      data.members = data.members.filter(u => u != user);
      data.membersName = data.membersName.filter(n => n != name);
      data.save()
      .then(data => {
        res.send({
          success: 'User successfully left',
          data: data
        })
      })
      .catch(err =>  console.log(err))
  })
  .catch(err =>  console.log(err))
})

// @route POST api/posts/createmsg
// @desc Create  message
// @access Users
// @returns String and msg data(details)
router.post('/createmsg', (req, res) => {
  const { text, createdBy, groupId, createdByName } = req.body
  let obj = {
    msgId: ''
  }
  const newMsg = new Message({
    text: text,
    createdBy: createdBy,
    groupId: groupId,
    createdByName: createdByName
  })
  newMsg
  .save()
  .then(data => {
    res.send({
      success: 'Message created successfully',
      data: data
    })
    obj.msgId = data._id
    User.findById(createdBy)
    .then(data => {
      data.messageId.push(obj.msgId)
      data.save()
    })
    .catch(err =>  console.log(err))
    Group.findById(groupId)
    .then(data => {
      data.messageId.push(obj.msgId)
      data.save()
    })
    .catch(err =>  console.log(err))
  })
  .catch(err =>  console.log(err))
})

module.exports = router;