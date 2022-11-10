const express = require('express')
const router = express.Router()
const passport = require('passport')
const ctrlContact = require('../../controller/indexContacts')
const ctrlUser = require('../../controller/indexUser')
const jwt = require('jsonwebtoken')
const User = require('../../models/shemas/user')
require('dotenv').config()
const secret = process.env.SECRET


router.get('/contacts', ctrlContact.getContacts)

router.get('/contacts/:id', ctrlContact.getContactById)

router.post('/contacts', ctrlContact.createContact)

router.put('/contacts/:id', ctrlContact.updateContact)

router.patch('/contacts/:id/favorite', ctrlContact.updateContactStatus)

router.delete('/contacts/:id', ctrlContact.removeContact)





router.post('/users/login', ctrlUser.login)

router.post('/users/registration', ctrlUser.registration)

const auth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (!user || err) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Unauthorized',
        data: 'Unauthorized',
      })
    }
    req.user = user
    next()
  })(req, res, next)
}

router.get('/users/current', auth, (req, res, next) => {
  const { email,subscription } = req.user
  
  res.json({
    status: 'success',
    code: 200,
    data: {
      message: `Authorization was successful`,
      email: `${email}`,
      subscription: `${subscription}`,
    },
  })
})

router.get('/users/logout', auth, async (req, res, next) => {
 try {
    const token = { token: null };
    const filter = { _id: req.user._id }
    await User.findOneAndUpdate(filter, token)
     res.json({ code: 204,   data: {
      message: `Byebye`
    } })
  }
  catch (error) {
    next(error)
  }
})

module.exports = router;
