import express from "express"
// model
import CalendarEvent from "../../models/CalendarEvent"
import User from "../../models/User"

const router = express.Router();

//Get event
router.get('/', (req, res)=>{
  res.send('calendar');
});

// @route GET api/posts/getallgroupcat
// @desc list group categories from latest to the oldest
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

// @route POST api/posts/newforumpost
// @desc Create a new thread
// @access Users
// @returns String and msg data(details)
router.post('/newevent', (req, res) => {
  console.log({body: req.body})
  const { title, start,desc, allDay, user } = req.body

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

module.exports = router;