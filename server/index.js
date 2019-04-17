const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const passport = require("passport");
const profile = require('./routes/api/profile');
const users = require("./routes/api/users");
const session=require('express-session');
const app = express();
require('dotenv').config();

const logger = require('morgan')// ADD

const keys=require("../config/keys");

//Middleware
//Middleware
// logger to log requests on console
app.use(logger('dev'))
app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
app.use(bodyParser.json());
app.use(cors());

app.use(session({
  secret: 'secret',//process.env.SESSION_SECRET,
  resave:true,
  saveUninitialized:true
}));


//DB Config
// const db = require("../config/keys").mongoURI;
const db = keys.db.mongoURI;

//Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Post
const posts = require('./routes/api/posts');
app.use('/api/posts',posts);


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Passport config
require("../config/passport")(passport);
// Routes

app.use("/api/users", users);
app.use("/api/profile", profile);


//Heroku, might need to change this
const port = process.env.PORT || 5000;
app.listen(port,() => console.log( `Server started on port ${port}`));
