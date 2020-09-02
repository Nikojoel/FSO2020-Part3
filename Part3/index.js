require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

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

app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(persons => {
        res.json(persons)
    }).catch(e => next(e))
})

app.get('/info', (req, res, next) => {
    Person.count({}).then(size => {
        res.send(`<p> The phonebook has info for ${size} persons</p><p>${new Date()}</p>`)
    }).catch(e => next(e))
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    }).catch(e => next(e))
})

app.delete('/api/persons/:id', (req, res, next) => {
   Person.findByIdAndRemove(req.params.id).then(result => {
       res.status(204).end()
   }).catch(e => {next(e)})
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const newNumber = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, newNumber, {new: true}).then(updated => {
        res.json(updated.toJSON())
    }).catch(e => next(e))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({error: 'content missing' })
    }
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save().then(saved => {
        res.json(saved)
    }).catch(e => next(e))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
