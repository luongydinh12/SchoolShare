"use strict";

var _express = _interopRequireDefault(require("express"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _morgan = _interopRequireDefault(require("morgan"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _passport = _interopRequireDefault(require("passport"));

var _users = _interopRequireDefault(require("./routes/api/users"));

var _profile = _interopRequireDefault(require("./routes/api/profile"));

var _groups = _interopRequireDefault(require("./routes/api/groups"));

var _posts = _interopRequireDefault(require("./routes/api/posts"));

var _keys = _interopRequireDefault(require("./config/keys"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

require('dotenv').config();

var app = (0, _express["default"])(); //Middleware
// logger to log requests on console

app.use((0, _morgan["default"])('dev'));
app.use(_bodyParser["default"].urlencoded({
  extended: false
}));
app.use(_bodyParser["default"].json());
app.use((0, _cors["default"])());
app.use((0, _expressSession["default"])({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
})); //DB Config

var db = _keys["default"].db.mongoURI; //Connect to MongoDB

_mongoose["default"].connect(db, {
  useNewUrlParser: true
}).then(function () {
  return console.log("MongoDB successfully connected");
})["catch"](function (err) {
  return console.log(err);
}); // Passport middleware


app.use(_passport["default"].initialize());
app.use(_passport["default"].session()); // Passport config

require("./config/passport")(_passport["default"]); // Routes


app.use("/api/users", _users["default"]);
app.use("/api/profile", _profile["default"]);
app.use('/api/groups', _groups["default"]);
app.use('/api/posts', _posts["default"]);
var port = process.env.PORT || 5000;
app.listen(port, function () {
  return console.log("Server started on port ".concat(port));
});