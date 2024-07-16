const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

let personName, personNumber

if (process.argv.length >= 5) {
  personName = process.argv[3]
  personNumber = process.argv[4]
}

const url =
  `mongodb+srv://saarol2:${password}@cluster0.dhkrskg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (personName && personNumber){
  const person = new Person({
    name: personName,
    number: personNumber
  })
  person.save().then(() => {
    console.log('added ' + personName + ' ' + personNumber + ' to phonebook')
    mongoose.connection.close()
  })
} else {
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      console.log(person.name + ' ' + person.number)
    })
    mongoose.connection.close()
  })
}