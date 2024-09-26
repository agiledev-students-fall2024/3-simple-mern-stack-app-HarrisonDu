require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')
const port = process.env.PORT || 3000

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

app.use('/images',express.static('public/images'))


// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')



app.get('/aboutUs', async (req, res) => {

  try {
    // Respond with a static object containing description, imageUrl, and name
    res.json({
      name: 'Harrison Du',
      description: ['Hi everyone, my name is Harry! I love learning new stuff and exert myself mentally and physically. Whether it\'s hitting the slopes for some snowboarding or diving into web scraping projects, I’m always looking for new things to learn.', 'I also led a quant club back at NYU, which was a lot of fun and a great way to dig deeper into finance and data science with other like-minded people. When I’m not working or learning,  I typically video games—Fallout 4 is my all-time favorite. I also learn guitar and like the genre Math Rock, with my favorite band being Chon. I’m also Chinese American and speak both English and Chinese, which has given me a cool blend of cultures to draw from. I am also relearning chinese at school to get back to my roots!', 'In terms of academics, I am studying Finance and Computer Science and I am in my senior year here at NYU. It is bitter sweet, but very exciting to finally become an adult!'],
      imageUrl: `http://localhost:${port}/images/harry.jpg`,
      status: 'all good'
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      error: err,
      status: 'failed to retrieve about info',
    });
  }
});


// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
