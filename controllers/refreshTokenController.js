const User = require('../model/User')

const jwt = require('jsonwebtoken')
const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies

  if (!cookies?.jwt) {
    return res.sendStatus(401)
  }

  const refreshToken = cookies.jwt
  const user = await User.findOne({ refreshToken }).exec()

  if (!user) {
    return res.sendStatus(401)
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user.username !== decoded.username) {
      console.error(err)
      return res.sendStatus(403).json({ message: 'Invalid refresh token' })
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
    res.json({ accessToken })
  })
}

module.exports = { handleRefreshToken }
