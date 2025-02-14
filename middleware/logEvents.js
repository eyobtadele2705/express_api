const { format } = require('date-fns')

const { v4: uuid } = require('uuid')

const fs = require('fs')
const path = require('path')
const fsPromise = require('fs').promises

const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')}`
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`
  console.log(logItem)

  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromise.mkdir(path.join(__dirname, '..', 'logs'))
    }
    await fsPromise.appendFile(
      path.join(__dirname, '..', 'logs', logName),
      logItem
    )
  } catch (err) {
    console.error(err)
  }
}

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt')
  console.log('middleware is running')
  next()
}

module.exports = { logger, logEvents }
