"use strict";

var _express = _interopRequireDefault(require("express"));

var _Group = _interopRequireDefault(require("../../models/Group"));

var _GroupCategory = _interopRequireDefault(require("../../models/GroupCategory"));

var _Messages = _interopRequireDefault(require("../../models/Messages"));

var _User = _interopRequireDefault(require("../../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// model
var router = _express["default"].Router(); //Get Posts


router.get('/', function (req, res) {
  res.send('posts');
}); // @route POST api/posts/creategroupcat
// @desc Create group category
// @access Users
// @returns String

router.post('/createcategory', function (req, res) {
  var name = req.body.name;

  _GroupCategory["default"].findOne({
    name: name
  }).then(function (data) {
    if (!data) {
      var newGroupCat = new _GroupCategory["default"]({
        name: name
      });
      newGroupCat.save().then(function (data) {
        res.send({
          success: 'Group category created successfully'
        });
      })["catch"](function (err) {
        return console.log(err);
      });
    } else {
      res.status(400).send({
        error: 'Group category already exists'
      });
    }
  })["catch"](function (err) {
    return console.log(err);
  });
}); // @route POST api/posts/creategroup
// @desc Create group
// @access Users
// @returns String

router.post('/creategroup', function (req, res) {
  console.log(req.body);
  var _req$body = req.body,
      name = _req$body.name,
      desc = _req$body.desc,
      createdBy = _req$body.createdBy,
      catId = _req$body.catId;
  var obj = {
    groupId: ''
  };

  _Group["default"].findOne({
    name: name
  }).then(function (data) {
    if (!data) {
      var newGroup = new _Group["default"]({
        name: name,
        desc: desc,
        createdBy: createdBy,
        catId: catId
      });
      newGroup.save().then(function (data) {
        res.send({
          success: 'Group created successfully'
        });
        obj.groupId = data._id;

        _GroupCategory["default"].findById(catId).then(function (data) {
          data.groupId.push(obj.groupId);
          data.save();
        })["catch"](function (err) {
          return console.log(err);
        });
      })["catch"](function (err) {
        return console.log(err);
      });
    } else {
      res.status(400).send({
        error: 'Group already exists'
      });
    }
  })["catch"](function (err) {
    return console.log(err);
  });
}); // @route GET api/posts/getallgroupcat
// @desc list group categories from latest to the oldest
// @access Users
// @returns Array of Object(s)

router.get('/getallcategories', function (req, res) {
  var limit = req.query.limit || 0;

  _GroupCategory["default"].find().sort({
    _id: -1
  }).limit(Number(limit)).then(function (data) {
    res.send({
      data: data
    });
  })["catch"](function (err) {
    return console.log(err);
  });
}); // @route GET api/posts/getallgroup
// @desc list group from latest to the oldest 
// @access Users
// @returns Array of Object(s)

router.get('/getallgroups', function (req, res) {
  var limit = req.query.limit || 0;

  _Group["default"].find({
    catId: req.query.catId
  }).sort({
    _id: -1
  }).limit(Number(limit)).then(function (data) {
    res.send({
      data: data
    });
  })["catch"](function (err) {
    return console.log(err);
  });
}); // @route GET api/posts/getGroupsByCategoryName
// @desc list groups from latest to the oldest, by category name
// @access Users
// @returns Array of Object(s)

router.get('/getGroupsByCategoryName', function (req, res) {
  var limit = req.query.limit || 0; //const _catId=GroupCategory.findOne({name:req.query.cat})

  _GroupCategory["default"].findOne({
    name: req.query.cat
  }).then(function (cat) {
    _Group["default"].find({
      catId: cat._id
    }).sort({
      _id: -1
    }).limit(Number(limit)).then(function (data) {
      res.send({
        data: data
      });
    })["catch"](function (err) {
      return console.log(err);
    });
  });
}); // @route GET api/posts/searchgroups
// @desc list matching groups from newest to oldest
// @access Users
// @returns Array of Object(s)

router.get('/searchgroups', function (req, res) {
  var q = req.query.query;

  _Group["default"].find({
    name: new RegExp(q, 'i')
  }).sort({
    date: -1
  }).then(function (data) {
    res.send(data);
  })["catch"](function (err) {
    return console.log(err);
  });
}); // @route GET api/posts/getmygroups 
// @desc list group that a user is subscribed to
// @access Users
// @returns Array of Object(s)

router.get('/getmygroups', function (req, res) {
  var user = req.query.user || undefined;
  if (!user) return console.error('No user specified');
  var myGroups = [];

  _Group["default"].find().then(function (data) {
    data.map(function (g) {
      // console.log({g})
      if (g.members.indexOf(user) != -1) {
        myGroups.push(g._id);
      }
    });

    _Group["default"].find({
      _id: {
        $in: myGroups
      }
    }).then(function (data) {
      res.send({
        data: data
      });
    })["catch"](function (err) {
      return console.log(err);
    });
  })["catch"](function (err) {
    return console.log(err);
  });
}); // @route GET api/posts/getgroup
// @desc get group categoriy and popilate all the groups in them in details from latest to the oldest
// @access Users
// @returns Array of Object(s)

router.get('/getgroup', function (req, res) {
  var groupId = req.query.id;

  _Group["default"].findById(groupId).populate('createdBy').populate('messageId').populate('catId').then(function (data) {
    res.send({
      data: data
    });
  })["catch"](function (err) {
    return console.log(err);
  });
}); // @route GET api/posts/joingroup
// @desc get group and add new member to it
// @access Users
// @returns Array of Object(s)

router.get('/joingroup', function (req, res) {
  var groupId = req.query.id;
  var user = req.query.user;
  var name = req.query.name;

  _Group["default"].findById(groupId).then(function (data) {
    data.members.push(user);
    data.membersName.push(name);
    data.save().then(function (data) {
      res.send({
        success: 'User successfully joined',
        data: data
      });
    })["catch"](function (err) {
      return console.log(err);
    });
  })["catch"](function (err) {
    return console.log(err);
  });
}); // @route GET api/posts/leaveGroup
// @desc get group and remove a memeber from it
// @access Users
// @returns Array of Object(s)

router.get('/leaveGroup', function (req, res) {
  var groupId = req.query.id;
  var user = req.query.user;
  var name = req.query.name;

  _Group["default"].findById(groupId).then(function (data) {
    data.members = data.members.filter(function (u) {
      return u != user;
    });
    data.membersName = data.membersName.filter(function (n) {
      return n != name;
    });
    data.save().then(function (data) {
      res.send({
        success: 'User successfully left',
        data: data
      });
    })["catch"](function (err) {
      return console.log(err);
    });
  })["catch"](function (err) {
    return console.log(err);
  });
}); // @route POST api/posts/createmsg
// @desc Create  message
// @access Users
// @returns String and msg data(details)

router.post('/createmsg', function (req, res) {
  var _req$body2 = req.body,
      text = _req$body2.text,
      createdBy = _req$body2.createdBy,
      groupId = _req$body2.groupId,
      createdByName = _req$body2.createdByName;
  var obj = {
    msgId: ''
  };
  var newMsg = new _Messages["default"]({
    text: text,
    createdBy: createdBy,
    groupId: groupId,
    createdByName: createdByName
  });
  newMsg.save().then(function (data) {
    res.send({
      success: 'Message created successfully',
      data: data
    });
    obj.msgId = data._id;

    _User["default"].findById(createdBy).then(function (data) {
      data.messageId.push(obj.msgId);
      data.save();
    })["catch"](function (err) {
      return console.log(err);
    });

    _Group["default"].findById(groupId).then(function (data) {
      data.messageId.push(obj.msgId);
      data.save();
    })["catch"](function (err) {
      return console.log(err);
    });
  })["catch"](function (err) {
    return console.log(err);
  });
});
module.exports = router;