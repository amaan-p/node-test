const express = require("express");
const cors = require('cors')
const mongoose = require('mongoose')
const Note = require('./models/note') //Note Model
require('dotenv').config();


const app = express();

app.use(cors())
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.static('dist'))


const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })


app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})

  
app.post('/api/notes', (request, response) => {
    const body = request.body
  
    if (body.content === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }
  
    const note = new Note({
      content: body.content,
      important: body.important || false,
    })
  
    note.save().then(savedNote => {
      response.json(savedNote)
    })
  })

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })


const PORT =process.nextTick.PORT||process.env.PORT
app.listen(PORT, () => console.log("server running"));
