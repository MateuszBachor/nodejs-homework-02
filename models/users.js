const User = require('./shemas/user')

const getAllUser= async () => {
  return User.find()
}

const createUser = ({ password, email }) => {
  return User.create({ password, email})
}

module.exports = {
  getAllUser,
  createUser,
}
