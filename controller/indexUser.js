const jwt = require('jsonwebtoken')
const User = require('./../models/shemas/user')
require('dotenv').config()
const secret = process.env.SECRET



const login =  async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user || !user.validPassword(password)) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Incorrect login or password',
      data: 'Bad request',
    })
  }

  const payload = {
    id: user.id,
    email: user.email,
  }

    const token = jwt.sign(payload, secret, { expiresIn: '1h' })
    await User.findOneAndUpdate({email}, {token})
  res.json({
    status: 'success',
    code: 200,
    data: {
      token,
    },
  })
} 

const registration = async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user) {
    return res.status(409).json({
      status: 'error',
      code: 409,
      message: 'Email is already in use',
      data: 'Conflict',
    })
  }
  try {
    const newUser = new User({  email })
    newUser.setPassword(password)
    await newUser.save()
    res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        message: 'Registration successful',
      },
    })
  } catch (error) {
    next(error)
  }
}



module.exports = {
    registration,
    login,
}
