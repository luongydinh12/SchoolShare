const express = require('express');
// model
const Group = require("../../models/Group");
const GroupCategory = require("../../models/GroupCategory");
const Message = require("../../models/Messages");
const User = require("../../models/User");
const Thread = require("../../models/Thread");
const Comment = require("../../models/Comment");
const CommentLike = require("../../models/CommentLike");
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
  const searchTerm = req.query.search || undefined;
  const searchOption = req.query.searchoption || undefined;
  const page = req.query.page - 1 || 0;
  if(!catId) return console.error('No category specified');

  if(!searchTerm || searchTerm == ""){
  Thread.count({category: catId, deleted: {$ne: true}}).then(count => {
    Thread.find({ category: catId, deleted: {$ne: true}})
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
  } else if(searchOption == 1) {
    Thread.count({category: catId, deleted: {$ne: true}, title: new RegExp(searchTerm, 'i')}).then(count => {
      Thread.find({ category: catId, deleted: {$ne: true}, title: new RegExp(searchTerm, 'i')})
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
  } else if(searchOption == 2) {
    User.find({name: new RegExp(searchTerm, 'i')}).select("_id").exec()
      .then(function(userList){
        Thread.count({category: catId, deleted: {$ne: true}, author: {$in: userList}}).then(count => {
          Thread.find({ category: catId, deleted: {$ne: true}, author: {$in: userList}})
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
      }).catch(err =>  console.log(err));
  }

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
// @access ID of post
// @returns Array of Object(s)
router.get('/getpostbyid', (req, res) => {
  const postID = req.query.id || undefined;
  if(!postID) return console.error('No post specified');

  Thread.findById(postID)
  .populate('author', 'name')
  .populate('saves')
  .exec()
  .then(post => {
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

// @route POST api/posts/editTitle
// @desc changes the title of the given thread
// @access ID of post
// @returns String and msg data(details)
router.post('/editTitle', (req,res) => {
  const postID = req.body.id || undefined;
  if(!postID) return console.error('No post specified');

  Thread.findByIdAndUpdate(postID, {title: req.body.newtitle})
  .then(data => {
    res.send(data)
  }).catch(err =>  console.log(err))
});

// @route POST api/posts/editDescription
// @desc changes the description of the given thread
// @access ID of post
// @returns String and msg data(details)
router.post('/editDescription', (req,res) => {
  const postID = req.body.id || undefined;
  if(!postID) return console.error('No post specified');

  Thread.findByIdAndUpdate(postID, {content: req.body.newdesc})
  .then(data => {
    res.send(data)
  }).catch(err =>  console.log(err))
});

// @route POST api/posts/deleteThread
// @desc hides thread from public view and hides description
// @access ID of post
// @returns String and msg data(details)
router.post('/deleteThread', (req,res) => {
  const postID = req.body.id || undefined;
  if(!postID) return console.error('No post specified');

  Thread.findByIdAndUpdate(postID, {deleted: true})
  .then(data => {
    res.send(data)
  }).catch(err =>  console.log(err))
});

// @route POST api/posts/restoreThread
// @desc hides thread from public view and hides description
// @access ID of post
// @returns String and msg data(details)
router.post('/restoreThread', (req,res) => {
  const postID = req.body.id || undefined;
  if(!postID) return console.error('No post specified');

  Thread.findByIdAndUpdate(postID, {deleted: false})
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
  .populate('likes')
  .exec()
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

// @route GET api/posts/likeComment
// @desc create like for a comment
// @access Users
// @returns an Object
router.post('/likeComment', (req, res) => {
  const commentId = req.body.commentId
  const userId = req.body.userId

  const newLike = new CommentLike({
    user: userId,
    comment: commentId
  })

  newLike
  .save()
  .then(data => {
    Comment.findById({_id: data.comment})
    .then(comment => {
      comment.likes.push(data._id)
      comment.save()
      console.log(comment)
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(404)
    })
    res.send(data)
  })
  .catch(err =>  console.log(err))
})

router.post('/unlikeComment', (req,res) => {
  const commentId = req.body.commentId
  const userId = req.body.userId

  CommentLike.findOneAndDelete({user: userId, comment : commentId })
  .then(like => {
    console.log("Like to be remove is: "+ like)
    console.log("Like to be remove is: "+ like._id)
    Comment.findById({_id : commentId})
    .then(comment=>{
      comment.likes.remove(like._id)
      comment.save();
    })
      res.send()
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(404)
  })
})

router.post('/saveThread', (req,res) => {
  const postId = req.body.postId
  const userId = req.body.userId

  Thread.findById({_id: postId})
  .then(thread => {
    User.findById({_id: userId})
    .then(user => {
      thread.saves.push(user)
      thread.save()
    })
    res.send(thread)
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(404)
  })
})

router.post('/unsaveThread', (req,res) => {
  const postId = req.body.postId
  const userId = req.body.userId

  Thread.findById({_id: postId})
  .then(thread => {
    console.log("Thread.save before deletion: "+ thread.saves);
    console.log("UserID: "+userId)
    thread.saves.remove(userId)
    console.log("Thread.save after deletion: "+ thread.saves);
    thread.save();
    res.send(thread)
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(404)
  })
})


router.get('/getmyposts', (req, res) => {
  const user = req.query.user || undefined;
  if(!user) return console.error('No user specified');
  let myPosts = [];
  Thread.find()
  .then(data => {
    data.map(g=>{
      // console.log({g})
      if(g.saves.indexOf(user) != -1) {
        myPosts.push(g._id);
      }
    });
    Thread.find({ _id: { $in: myPosts }}).then(data => {
      console.log(data)
      res.send({data});
    }).catch(err =>  console.log(err))

  })
  .catch(err =>  console.log(err))
})  

module.exports = router;