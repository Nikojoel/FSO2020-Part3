require('dotenv').config()
const mongoose = require('mongoose')
const validator = require('mongoose-unique-validator');
mongoose.set('useFindAndModify', false)

mongoose.set('useCreateIndex', true)

const url = process.env.MONGODB

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })


const personSchema = new mongoose.Schema({
    name: {type: String, minlength: 3, unique: true, required: true},
    number: {type: String, minlength: 8, required: true}
})

personSchema.plugin(validator)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)