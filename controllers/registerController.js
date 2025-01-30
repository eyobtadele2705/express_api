const User = require('../model/User')

const bcrypt = require('bcrypt')

const handleNewUser = async (req, res) => {
  const { user, password } = req.body

  if (!user || !password) {
    return res.status(400).json({ error: 'username and password are required' })
  }
  // check if the user is already existing
  const existingUser = await User.findOne({ username: user }).exec()
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' })
  }

  try {
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // add the new user to the database
    const result = await User.create({
      username: user,
      password: hashedPassword,
    })

    console.log(result)

    res.status(201).json({ message: 'User created successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { handleNewUser }
