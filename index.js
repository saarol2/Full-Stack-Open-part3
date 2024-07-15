require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (request) => {
  return JSON.stringify(request.body);
})
const format = ':method :url :status :res[content-length] - :response-time ms :body'
app.use(morgan(format));

let persons = [
  { 
    id: "1",
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: "2",
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: "3",
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: "4",
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
  response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
  response.json(person)
  })
})

app.get('/info', (request, response) => {
  const date = new Date()
  const count = persons.length
  const text = `
  <p>Phonebook has info for ${count} people</p>
  <p>${date}</p>
`
  response.send(text)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const id = Math.floor(Math.random() * 1000000).toString()
  return id
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    id: generateId(),
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

/*app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  if (persons.some(person => person.name === body.name)){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})*/


const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)