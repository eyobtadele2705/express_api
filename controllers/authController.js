const User = require('../model/User')

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const handleAuthRequest = async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' })
  }
  const user = await User.findOne({ username: username }).exec()

  if (!user) {
    return res.status(401).json({ message: 'Invalid username ' })
  }

  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    return res.status(401).json({ message: 'Invalid password' })
  }

  const roles = Object.values(user.roles)
  const accessToken = jwt.sign(
    {
      userInfo: {
        username: user.username,
        roles: roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '5m',
    }
  )
  const refreshToken = jwt.sign(
    { username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '1d',
    }
  )

  user.refreshToken = refreshToken
  const result = await user.save()

  console.log(result)

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    sameSite: 'None',
    // secure: true,
    maxAge: 60 * 60 * 24 * 1000,
  }) // secure: true   => which works only for https - use in production
  return res.json({
    accessToken,
  })
}

module.exports = { handleAuthRequest }
