import express from "express"
import session from "express-session"
import logger from "morgan"
import bodyParser from "body-parser"
import cors from "cors"
import mongoose from "mongoose"
import passport from "passport"

import users from "./routes/api/users"
import profile from "./routes/api/profile"
import groups from "./routes/api/groups"
import posts from "./routes/api/posts"
import friends from "./routes/api/friends"

import keys from "./config/keys"

require('dotenv').config();

const app = express();

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
  secret: 'secret',
  resave:true,
  saveUninitialized:true
}));


//DB Config
const db = keys.db.mongoURI;

//Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use('/api/groups',groups);
app.use('/api/posts',posts);
app.use('/api/friends',friends)


const port = process.env.PORT || 5000;
app.listen(port,() => console.log( `Server started on port ${port}`));
