const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('content', function (request) {return JSON.stringify(request.body)})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))


let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Front page of the phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    console.log('This is the info page')
    const noOfPersons = persons.length
    console.log(noOfPersons)

    const date = new Date()
    const timeStamp = date

    response.send(
                `<div>Phonebook has info for ${noOfPersons} people</div>
                <br/>
                ${timeStamp}`)
})

app.get('/api/persons/:id', (request, response) => {
    console.log('This is the single person page')
    const person = persons.find(person => person.id === Number(request.params.id))

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    console.log('This is the DELETE request')
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    console.log('This is the POST section')
    const id = Math.floor(Math.random() * 10000000000)
    console.log(id)

    if (!request.body.name || !request.body.number) {
        return response.status(400).json({ 
            error: 'name or number missing' 
          })
    }

    const duplicate = persons.find(person => person.name === request.body.name)

    if (duplicate) {
        return response.status(400).json({
            error: 'person with that name is already in the phonebook. Name must be unique.'
        })

    }

    const person = {
        id: id,
        name: request.body.name,
        number: request.body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server active on chosen port ${PORT}`)
})