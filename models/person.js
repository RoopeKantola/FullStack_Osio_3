const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to: ', url)
mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      required: [true, 'The name must be at least 3 characters long']
    },
    number: {
      type: String,
      validate: {
        validator: function(phonenumber) {
            return (/(\d{2}-\d{5,})|(\d{3}-\d{4,})/).test(phonenumber)
        }
      },
      required: [true, 'The phone number is malformatted. It must contain 2 or 3 number before "-" and must be at least 8 characters long of which 7 must be numbers.']
    }
  })

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)