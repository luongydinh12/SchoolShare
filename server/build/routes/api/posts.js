"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express'); // model


var Group = require("../../models/Group");

var GroupCategory = require("../../models/GroupCategory");

var Message = require("../../models/Messages");

var User = require("../../models/User");

var Thread = require("../../models/Thread");

var Comment = require("../../models/Comment");

var router = express.Router();

var mongoose = require('mongoose'); //Get Posts


router.get('/', function (req, res) {
  res.send('posts');
}); // @route GET api/posts/getpostsforcat
// @desc get posts for a specific category
// @access Users
// @returns Array of Object(s)

router.get('/getpostsforcat', function (req, res) {
  var catId = req.query.catId || undefined;
  var page = req.query.page - 1 || 0;
  if (!catId) return console.error('No category specified');
  Thread.count({
    category: catId
  }).then(function (count) {
    Thread.find({
      category: catId
    }).populate('author', '_id name').sort({
      _id: -1
    }).limit(10).skip(page * 10).then(function (data) {
      res.send({
        totalPosts: count,
        totalPages: Math.ceil(count / 10),
        posts: data
      });
    })["catch"](function (err) {
      return console.log(err);
    });
  })["catch"](function (err) {
    return console.log(err);
  });
}); // @route POST api/posts/newforumpost
// @desc Create a new thread
// @access Users
// @returns String and msg data(details)

router.post('/newforumpost', function (req, res) {
  console.log({
    body: req.body
  });
  var _req$body = req.body,
      title = _req$body.title,
      content = _req$body.content,
      author = _req$body.author,
      category = _req$body.category;
  var newThread = new Thread({
    title: title,
    content: content,
    author: author,
    category: category
  });
  newThread.save().then(function (data) {
    res.send({
      success: 'Post created successfully',
      data: data
    });
  })["catch"](function (err) {
    return console.log(err);
  });
}); // @route GET api/posts/getpostbyid
// @desc get posts for a specific category
// @access Users
// @returns Array of Object(s)

router.get('/getpostbyid', function (req, res) {
  var postID = req.query.id || undefined;
  if (!postID) return console.error('No post specified');
  Thread.findById(postID).populate('author', 'name').then(function (post) {
    if (post) {
      Comment.count({
        thread: postID
      }).then(function (count) {
        res.send(_objectSpread({}, post._doc, {
          commentCount: count
        }));
      });
    } else {
      res.sendStatus(404);
    }
  })["catch"](function (err) {
    return console.log(err);
  });
}); // @route POST api/posts/postReply
// @desc Create a thread reply
// @access Users
// @returns String and msg data(details)

router.post('/postReply', function (req, res) {
  console.log({
    body: req.body
  });
  var _req$body2 = req.body,
      parent = _req$body2.parent,
      thread = _req$body2.thread,
      content = _req$body2.content,
      author = _req$body2.author;
  var newComment = new Comment({
    parent: parent,
    thread: thread,
    content: content,
    author: author
  });
  newComment.save().then(function (data) {
    res.send(data);
  })["catch"](function (err) {
    return console.log(err);
  });
}); // @route GET api/posts/getComments
// @desc Gets top level comments
// @access Users
// @returns String and msg data(details)

router.get('/getComments', function (req, res) {
  console.log({
    query: req.query
  });
  var id = req.query.id;
  Comment.find({
    parent: id
  }).populate('author', 'name').then(function (data) {
    res.send(data);
  })["catch"](function (err) {
    return console.log(err);
  });
}); // @route POST api/posts/editComment
// @desc Changes content of selected comment
// @access Comment
// @returns String and msg data(details)

router.post('/editComment', function (req, res) {
  var postID = req.body.id || undefined;
  if (!postID) return console.error('No post specified');
  Comment.findByIdAndUpdate({
    _id: postID
  }, {
    content: req.body.content
  }).then(function (data) {
    res.send(data);
  })["catch"](function (err) {
    return console.log(err);
  });
}); // @route POST api/posts/deleteComment
// @desc Deletes given comment
// @access Comment
// @returns String and msg data(details)

router.post('/deleteComment', function (req, res) {
  var postID = req.body.id || undefined;
  if (!postID) return console.error('No post specified');
  Comment.findByIdAndUpdate({
    _id: postID
  }, {
    deleted: true
  }).then(function (data) {
    res.send(data);
  })["catch"](function (err) {
    return console.log(err);
  });
}); // @route POST api/posts/deleteComment
// @desc Reveals previously deleted comment
// @access Comment
// @returns String and msg data(details)

router.post('/restoreComment', function (req, res) {
  var postID = req.body.id || undefined;
  if (!postID) return console.error('No post specified');
  Comment.findByIdAndUpdate({
    _id: postID
  }, {
    deleted: false
  }).then(function (data) {
    res.send(data);
  })["catch"](function (err) {
    return console.log(err);
  });
});
module.exports = router;