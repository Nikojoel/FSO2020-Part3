const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.oposy.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const add = (name, number) => {
    const person = new Person({
        name: name,
        number: number,
    })
    person.save().then(result => {
        console.log(`Added ${person.name} ${person.number} to the phonebook`)
        mongoose.connection.close()
    })
}

const getAll = () => {
    console.log("phonebook:")
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.number)
            mongoose.connection.close()
        })
    })
}

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js YOURPASSWORD')
    process.exit(1)
} else if (process.argv.length === 3) {
    getAll()
} else if (process.argv.length === 5) {
    add(process.argv[3], process.argv[4])
}