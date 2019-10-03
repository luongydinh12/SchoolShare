const express = require('express');
// model
const Group = require("../../models/Group");
const GroupCategory = require("../../models/GroupCategory");
const Message = require("../../models/Messages");
const User = require("../../models/User");
const Thread = require("../../models/Thread");
const Comment = require("../../models/Comment");
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

// @route GET api/posts/getpostbyid
// @desc get posts for a specific category
// @access Users
// @returns Array of Object(s)
router.get('/getpostbyid', (req, res) => {
  const postID = req.query.id || undefined;
  if(!postID) return console.error('No post specified');

  Thread.findById(postID).populate('author', 'name').then(post => {
    if(post){
      Comment.count({thread: postID}).then(count => {
        res.send({...post._doc, commentCount: count}); 
      })
    } else {
      res.sendStatus(404);
    }
  })
    .catch(err =>  console.log(err))

});

// @route GET api/posts/editTitle
// @desc changes the title of the given thread
// @access Users
// @returns String and msg data(details)
router.post('/editTitle', (req,res) => {
  const postID = req.body.id || undefined;
  if(!postID) return console.error('No post specified');

  Thread.findByIdAndUpdate(postID, {title: req.body.newtitle})
  .then(data => {
    res.send(data)
  }).catch(err =>  console.log(err))
});

// @route GET api/posts/editDescription
// @desc changes the description of the given thread
// @access Users
// @returns String and msg data(details)
router.post('/editDescription', (req,res) => {
  const postID = req.body.id || undefined;
  if(!postID) return console.error('No post specified');

  Thread.findByIdAndUpdate(postID, {content: req.body.newdesc})
  .then(data => {
    res.send(data)
  }).catch(err =>  console.log(err))
});

// @route POST api/posts/postReply
// @desc Create a thread reply
// @access Users
// @returns String and msg data(details)
router.post('/postReply', (req, res) => {
  console.log({body: req.body})
  const { parent, thread, content, author } = req.body

  const newComment = new Comment({
    parent,
    thread,
    content,
    author,
  })

  newComment
  .save()
  .then(data => {
    res.send(data)
  })
  .catch(err =>  console.log(err))
})

// @route GET api/posts/getComments
// @desc Gets top level comments
// @access Users
// @returns String and msg data(details)
router.get('/getComments', (req, res) => {
  console.log({query: req.query})
  const { id } = req.query;

  Comment.find({ parent: id })
  .populate('author', 'name')
  .then(data => {
    res.send(data)
  })
  .catch(err =>  console.log(err))
})

// @route POST api/posts/editComment
// @desc Changes content of selected comment
// @access Comment
// @returns String and msg data(details)
router.post('/editComment', (req, res) => {
  const postID = req.body.id || undefined;
  if(!postID) return console.error('No post specified');

  Comment.findByIdAndUpdate({_id: postID},{content: req.body.content})
  .then(data => {
    res.send(data)
  }).catch(err =>  console.log(err))
})
// @route POST api/posts/deleteComment
// @desc Deletes given comment
// @access Comment
// @returns String and msg data(details)
router.post('/deleteComment', (req, res) => {
  const postID = req.body.id || undefined;
  if(!postID) return console.error('No post specified');

  Comment.findByIdAndUpdate({_id: postID},{deleted: true})
  .then(data => {
    res.send(data)
  }).catch(err =>  console.log(err))
})

// @route POST api/posts/deleteComment
// @desc Reveals previously deleted comment
// @access Comment
// @returns String and msg data(details)
router.post('/restoreComment', (req, res) => {
  const postID = req.body.id || undefined;
  if(!postID) return console.error('No post specified');

  Comment.findByIdAndUpdate({_id: postID},{deleted: false})
  .then(data => {
    res.send(data)
  }).catch(err =>  console.log(err))
})

module.exports = router;