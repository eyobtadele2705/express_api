const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI_LOCAL)
    console.log('MongoDB Connected...')
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
