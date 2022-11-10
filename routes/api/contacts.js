const express = require('express')
const router = express.Router()
const ctrlContact = require('./../../controller/index')

router.get('/contacts', ctrlContact.get)

router.get('/contacts/:id', ctrlContact.getById)

router.post('/contacts', ctrlContact.create)

router.put('/contacts/:id', ctrlContact.update)

router.patch('/contacts/:id/favorite', ctrlContact.updateStatus)

router.delete('/contacts/:id', ctrlContact.remove)

module.exports = router
