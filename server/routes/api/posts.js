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
router.post('/creategroupcat', (req, res) => {
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
router.get('/getallgroupcat', (req, res) => {
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

// @route GET api/posts/getgroupcat
// @desc get group categoriy and popilate all the groups in them in details from latest to the oldest
// @access Users
// @returns Array of Object(s)
router.get('/getgroupcat', (req, res) => {
  const groupCatId  = req.query.id
  GroupCategory.findById(groupCatId)
  .populate('groupId')
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
router.get('/getallgroup', (req, res) => {
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