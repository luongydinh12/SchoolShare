const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const passport = require("passport");
const profile = require('./routes/api/profile');
const users = require("./routes/api/users");
const groups = require("./routes/api/groups");

const app = express();

const keys=require("../config/keys");

const http=require('http').Server(app);
const io=require('socket.io')(http);
io.on('connection',function(socket){
 
  console.log("socekt.io connected");
  socket.on('disconnect',function(){
    console.log("socket.io disconnected");
  });
  socket.on('example_message',function(msg){
    console.log('message:\t'+msg);
  })
})
// io.on('connection',(client)=>{
// console.log("connection)");
// client.on('subscribe',(interval)=>{
//   console.log("client is subscribing with interval ",interval);
//   setInterval(()=>{
//     client.emit('timer',new Date());
//   },interval);
// });
// });
io.listen(5050);

//Middleware
app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
app.use(bodyParser.json());
app.use(cors());

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
// Passport config
require("../config/passport")(passport);
// Routes

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/groups",groups);


//Heroku, might need to change this
const port = process.env.PORT || 5000;
app.listen(port,() => console.log( `Server started on port ${port}`));
