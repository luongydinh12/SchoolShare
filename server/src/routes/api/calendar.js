import express from "express"
// model
import CalendarEvent from "../../models/CalendarEvent"
import User from "../../models/User"

const router = express.Router();

//Get event
router.get('/', (req, res)=>{
  res.send('calendar');
});

// @route GET api/posts/getallevents
// @desc list of events created by user
// @access Users
// @returns Array of Object(s)
router.get('/getallevents', (req, res) => {
    const user = req.query.user || undefined;
    if(!user){
      console.error('No user specified');
      res.sendStatus(403)
    }

    CalendarEvent.find({ user: user}).then(data => {
        res.send({data});
    }).catch(err =>  console.log(err))

  })

// @route POST api/posts/newevent
// @desc Create a new event
// @access Users
// @returns String and msg data(details)
router.post('/newevent', (req, res) => {
  console.log({body: req.body})
  //const { title, start,desc, allDay, user } = req.body
  const title = req.body.title
  const start = req.body.start
  const desc = req.body.desc
  const user = req.body.user
  const allDay = req.body.allDay
  const newEvent = new CalendarEvent({
    title: title,
    desc:desc,
    date:start,
    allDay:allDay,
    user:user
  })

  newEvent
  .save()
  .then(data => {
    res.send({
      success: 'Calendar event created successfully',
      data: data
    })
  })
  .catch(err =>  console.log(err))
})

// @route POST api/posts/deleteevent
// @desc Delete given event
// @access Calendar
// @returns String and msg data(details)
router.post('/deleteevent', (req, res) => {
  const title = req.body.title
  const start = req.body.start
  const desc = req.body.desc
  const user = req.body.user
  console.log(user)
  CalendarEvent.findOne({title: title, desc: desc, user: user, date: start}, (err, event) => {
    if(event) {
      console.log(event)
      event.remove()
      CalendarEvent.find({ user: user}).then(data => {
        res.send({data});})
    } else {
      console.log(err)
      res.send(404)
    }
  }) 
})


// @route POST api/posts/editmsg
// @desc Edit message
// @access Users
// @returns msg data(details)
router.post('/editevent', (req, res) => {
  console.log({body: req.body})
  const title = req.body.title
  const start = req.body.start
  const desc = req.body.desc
  const user = req.body.user
  CalendarEvent.findOne({title: title, user: user, date: start}, (err, event) => {
    if(event) {
      event.title = title;
      event.desc = desc;
      event.save()
      CalendarEvent.find({ user: user}).then(data => {
        res.send({data});})
    } else {
      console.log(err)
      res.send(404)
    }
  })
})
module.exports = router;