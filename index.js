require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())


morgan.token('content', function (request) {return JSON.stringify(request.body)})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))



app.get('/', (request, response, next) => {
  response.send('<h1>Front page of the phonebook</h1>')
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  console.log('This is the info page')
  Person.find({}).then(persons => {
    const noOfPersons = persons.length
    const date = new Date()
    const timeStamp = date
    response.send(
      `<div>Phonebook has info for ${noOfPersons} people</div>
                <br/>
                ${timeStamp}`)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  console.log('This is the single person page')
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  console.log('This is the POST section')

  if (!request.body.name || !request.body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const person = new Person({
    name: request.body.name,
    number: request.body.number
  })

  person.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id, { name, number },  { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server active on chosen port ${PORT}`)
})