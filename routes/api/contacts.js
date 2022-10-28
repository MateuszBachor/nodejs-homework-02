const express = require('express')
const contacts = require('./../../models/contacts');
const router = express.Router()


router.get('/', async (req, res, next) => {
  const contactFunction = await contacts.listContacts()
  res.status(200).json(contactFunction)
})

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params
  const contactFunction = await contacts.getContactById(contactId)
 res.status(200).json(contactFunction)
})

router.post('/', async (req, res, next) => {
  const newContact = req.body
  const contactFunction = await contacts.addContact(newContact)
  res.status(201).json(contactFunction)
})

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params
  const contactFunction = await contacts.removeContact(contactId)
  res.status(200).json(contactFunction)

})

router.put('/:contactId', async (req, res, next) => {
  const newContact = req.body
  const { contactId } = req.params
  const contactFunction = await contacts.updateContact(contactId, newContact)
  res.status(200).json(contactFunction)

})

module.exports = router
