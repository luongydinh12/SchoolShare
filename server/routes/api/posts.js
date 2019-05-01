const express = require('express');
// model
const Group = require("../../../models/Group");
const GroupCategory = require("../../../models/GroupCategory");
const Message = require("../../../models/Messages");
const User = require("../../../models/User");
const Thread = require("../../../models/Thread");
const router = express.Router();
const mongoose = require('mongoose');

//Get Posts
router.get('/', (req, res)=>{
  res.send('posts');
});


// @route GET api/posts/getpostsforcat
// @desc get posts for a specific category
// @access Users
// @returns Array of Object(s)
router.get('/getpostsforcat', (req, res) => {
  const catId = req.query.catId || undefined;
  const page = req.query.page - 1 || 0;
  if(!catId) return console.error('No category specified');

  Thread.count({category: catId}).then(count => {
    Thread.find({ category: catId })
    .populate('author' , '_id name')
    .sort({ _id: -1})
    .limit(10)
    .skip(page * 10)
    .then(data => {
      res.send({
        totalPosts: count,
        totalPages: Math.ceil(count/10),
        posts: data
      });
    })
    .catch(err =>  console.log(err))
  }).catch(err =>  console.log(err))


})

// @route POST api/posts/newforumpost
// @desc Create a new thread
// @access Users
// @returns String and msg data(details)
router.post('/newforumpost', (req, res) => {
  console.log({body: req.body})
  const { title, content, author, category } = req.body

  const newThread = new Thread({
    title,
    content,
    author,
    category
  })

  newThread
  .save()
  .then(data => {
    res.send({
      success: 'Post created successfully',
      data: data
    })
  })
  .catch(err =>  console.log(err))
})

module.exports = router;

// @route GET api/posts/getpostbyid
// @desc get posts for a specific category
// @access Users
// @returns Array of Object(s)
router.get('/getpostbyid', (req, res) => {
  const postID = req.query.id || undefined;
  if(!postID) return console.error('No post specified');

  Thread.findById(postID).populate('author', 'name').then(post => {
    if(post){
      
        res.send({...post._doc });
      
    } else {
      res.sendStatus(404);
    }
  })
    .catch(err =>  console.log(err))

});