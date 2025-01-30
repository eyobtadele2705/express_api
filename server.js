require('dotenv').config()
const path = require('path')
const express = require('express')
const { console } = require('inspector')
const app = express()
const cors = require('cors')
const corsOptions = require('./config/corsOption')
const errorHandler = require('./middleware/errorHandler')
const verifyJwt = require('./middleware/verifyJwt')
const { logger, logEvents } = require('./middleware/logEvents')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')
const mongoose = require('mongoose')

const connectDB = require('./config/dbConn')

const PORT = process.env.PORT || 3500

connectDB()

app.use(logger)

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

app.use(express.static(path.join(__dirname, '/public')))
app.use('/subdir', express.static(path.join(__dirname, '/public')))
app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/api/auth'))
app.use('/subdir', require('./routes/subdir'))
app.use('/users', require('./routes/api/users'))
app.use('/refreshToken', require('./routes/api/refresh'))
app.use('/logout', require('./routes/api/logout'))

app.use(verifyJwt)
app.use('/employees', require('./routes/api/employees'))

app.use(cors(corsOptions))

app.get('/chain', [one, two, three])

function one(req, res, next) {
  console.log('Executing middleware 1')
  next()
}

function two(req, res, next) {
  console.log('Executing middleware 2')
  next()
}

function three(req, res) {
  console.log('Executing middleware 3')
  res.send('Middleware 3 executed')
}

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ error: 'Page not found' })
  } else {
    res.type('text').send('Page not found')
  }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('MongoDB connected')
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})
