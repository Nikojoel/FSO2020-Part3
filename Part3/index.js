require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

const checkIfPost = (req) => req.method === 'POST'
const format = ':method :url :status :res[content-length] - :response-time ms :body'

app.use(morgan('tiny', {
    skip: checkIfPost
}))

app.use(morgan(format, {
    skip: (req, res) => !checkIfPost(req, res)
}))

morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    },
];

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/info', (req, res) => {
    res.send(`<p> The phonebook has info for ${persons.length} persons</p><p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
        res.json(person)
    })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({ error: 'content missing' })
    }
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save().then(saved => {
        res.json(saved)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
