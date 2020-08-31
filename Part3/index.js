const express = require('express')
const morgan = require('morgan')
const parser = require('body-parser')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(parser.json())
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
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`<p> The phonebook has info for ${persons.length} persons</p><p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const found = persons.find(person => person.id === id)
    if (found) {
        res.send(found)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const generateId = () => {
    return Math.round(Math.random() * 1234567)
}

app.post('/api/persons', (req, res) => {
    if (!req.body.name || !req.body.number) {
        return res.status(400).json({error: "Must include name and number"})
    } else if (persons.find(person => person.name === req.body.name)) {
        return res.status(400).json({error: "Name must be unique"})
    }
    const person = {
        name: req.body.name,
        number: req.body.number,
        id: generateId()
    }
    persons = persons.concat(person)
    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
