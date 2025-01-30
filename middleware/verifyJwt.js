const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyJwt = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Missing JWT token' })
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = decoded.userInfo.username
    req.roles = decoded.userInfo.roles
    next()
  } catch (error) {
    res.status(403).json({ message: 'Invalid JWT token' })
  }
}

module.exports = verifyJwt
