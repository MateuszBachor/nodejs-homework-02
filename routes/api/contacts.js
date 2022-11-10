const express = require('express')
const contacts = require('./../../models/contacts');
const router = express.Router()
const Joi = require('joi');

const postSchema = Joi.object({
  name:Joi.string().min(1).required(),
  email:Joi.string().email().min(5).required(),
  phone:Joi.string().min(9).required()
})


const putSchema = Joi.object({
  name:Joi.string().min(1),
  email:Joi.string().email().min(5),
  phone:Joi.number().min(9)
})


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
  const { error, value } = postSchema.validate(req.body)
  if (error) {
    console.log(error)
    return res.status(400).json({message:'missing required name field'})
  }
  const contactFunction = await contacts.addContact(value)
  res.status(201).json(contactFunction)
})

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params
  const contactFunction = await contacts.removeContact(contactId)
  if (contactFunction.length) {
  res.status(200).json(contactFunction)    
  } else {
    res.status(404).json({ message: 'Not found' })
  }

})

router.put('/:contactId', async (req, res, next) => {
  const { error, value } = putSchema.validate(req.body)
  const { contactId } = req.params
  const isObjectEmpty = (object) => {
  return !Object.entries(object).length;
}
  if (isObjectEmpty(req.body)) {
    return res.status(400).json({message:'missing fields'})
  }
  if (error) {
    return res.status(404).json({message: "Not found"})
  }
  const contactFunction = await contacts.updateContact(contactId, value)
  res.status(200).json(contactFunction)

})

module.exports = router
