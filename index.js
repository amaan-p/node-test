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
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end() 
      }
    })
    .catch(error => {
      console.log(error)

      response.status(400).send({ error: 'malformatted id' })
    })
})

  
app.post('/api/notes', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })

    .catch(error => next(error))
})

  app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })

  app.put('/api/notes/:id', (request, response, next) => {

    const { content, important } = request.body
  
    Note.findByIdAndUpdate(
      request.params.id, 
  
      { content, important },
      { new: true, runValidators: true, context: 'query' }
    ) 
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))
  })

const PORT =process.nextTick.PORT||process.env.PORT
app.listen(PORT, () => console.log("server running"));
