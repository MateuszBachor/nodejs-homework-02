const User = require('./shemas/user')

const getAllUser= async () => {
  return User.find()
}

const createUser = ({ password, email }) => {
  return User.create({ password, email})
}
const getUserById = (verificationToken) => {
  return User.findOne({ verificationToken: verificationToken })
}

module.exports = {
  getAllUser,
  createUser,
  getUserById
}
