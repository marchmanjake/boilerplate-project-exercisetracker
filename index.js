const express = require('express')
const mongoose = require('mongoose');
const validator = require('validator');
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
require('dotenv').config()

/*Set up mongoose connection */
const dbUrl = process.env.MONGOOSE_URI;
mongoose.connect(dbUrl);

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

/*
  Setup mangodb here
*/


const exerciseSchema = new mongoose.Schema({
  username: {
    type: String, 
    required: true
  },
  log: []
})


let Exercise = mongoose.model('Exercise', exerciseSchema);


app.post('/api/users', (req, res) => { 
  console.log("TEST")

  /*2. You can POST to /api/users with form data username to create a new user.*/
  /*3. The returned response from POST /api/users with form data username will be an object with username and _id properties.*/
  //test post
  console.log(req.body)
  let user = new Exercise({ 
    username: req.body.username
  })
  user
  .save()
  .then((doc) => {
    res.send(doc);
  })
  .catch((err) => {
    res.send(err);
  });
})

app.get("/api/users", (req, res)=>{
  /*4. You can make a GET request to /api/users to get a list of all users.*/
  /*5. The GET request to /api/users returns an array.*/
  /*6. Each element in the array returned from GET /api/users is an object literal containing a user's username and _id.*/
  console.log("TEST")
  Exercise.find()
  .exec()
  .then((docs)=>{
    console.log(docs)
    res.send(docs)

  }
  )
  .catch((err)=>{
    console.log(err)
    res.send(err)
  }
  )
  
})

app.post("/api/users/:_id/exercises", (req, res)=>{
  /*7. You can POST to /api/users/:_id/exercises with form data description, duration, and optionally date. If no date is supplied, the current date will be used.*/
  /* 8. The response returned from POST /api/users/:_id/exercises will be the user object with the exercise fields added.*/

  console.log(req.body)
  console.log(req.params._id)
  let submittedDate;

  console.log("test")
  console.log(new Date())
  

  if (req.body.date){
    console.log("not null date")
    console.log(req.body.date)
    submittedDate = new Date(req.body.date.split("-")[0], req.body.date.split("-")[1], req.body.date.split("-")[2]);
    console.log(submittedDate)
  } 
  else{
    submittedDate = new Date()
    console.log(submittedDate)
  }

  console.log(submittedDate.toDateString())

  Exercise.findById(req.params._id)
    .then((doc)=>{
      console.log(doc)
      doc.log.push({
        description: req.body.description,
        duration: req.body.duration,
        date: submittedDate.toDateString()
      })
      doc.save()
        .then((savedDoc)=>{
          let returnObj = {
            username: savedDoc.username,
            count: savedDoc.log.length,
            _id: savedDoc._id.toString(),
            log: savedDoc.log,
          }
          console.log("return!")
          console.log(returnObj)
          res.json(returnObj)
        })
        .catch((err)=>{res.send("Failed Save")})

      
      })
    .catch((err)=>{
      console.log(err)
        res.send("Failed Post")
      })
  })

app.get("/api/users/:_id/logs", (req, res)=>{
  /* 9. You can make a GET request to /api/users/:_id/logs to retrieve a full exercise log of any user. */
  /* 10. A request to a user's log GET /api/users/:_id/logs returns a user object with a count property representing the number of exercises that belong to that user. */
  /* 11. A GET request to /api/users/:_id/logs will return the user object with a log array of all the exercises added. */
  /* 12. Each item in the log array that is returned from GET /api/users/:_id/logs is an object that should have a description, duration, and date properties. */
  /* 13. The description property of any object in the log array that is returned from GET /api/users/:_id/logs should be a string. */
  /*14. The duration property of any object in the log array that is returned from GET /api/users/:_id/logs should be a number.*/
  /* 15. The date property of any object in the log array that is returned from GET /api/users/:_id/logs should be a string. Use the dateString format of the Date API.*/
  /* 16. You can add from, to and limit parameters to a GET /api/users/:_id/logs request to retrieve part of the log of any user. from and to are dates in yyyy-mm-dd format. limit is an integer of how many logs to send back. */
  

  
  res.send("id returned")
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
