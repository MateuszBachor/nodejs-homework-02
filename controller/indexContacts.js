const service = require('../models/contacts')

const getContacts = async (req, res, next) => {
  try {
    const results = await service.getAllContacts()
    res.json({
      status: 'success',
      code: 200,
      data: {
        contacts: results,
      },
    }) 
  } catch (e) {
    console.error(e)
    next(e)
  }
}

const getContactById = async (req, res, next) => {
  const { id } = req.params
  try {
    const result = await service.getContactById(id)
    if (result) {
      res.json({
        status: 'success',
        code: 200,
        data: { contact: result },
      })
    } else {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: `Not found task id: ${id}`,
        data: 'Not Found',
      })
    }
  } catch (e) {
    console.error(e)
    next(e)
  }
}

const createContact = async (req, res, next) => {
    const { name, email, phone, favorite } = req.body
    if (req.body.favorite) {
        req.body.favorite=true
    }
  try {
    const result = await service.createContact({ name, email, phone, favorite })

    res.status(201).json({
      status: 'success',
      code: 201,
      data: { contact: result },
    })
  } catch (e) {
    console.error(e)
    next(e)
  }
}

const updateContact = async (req, res, next) => {
  const { id } = req.params
  const { name, email, phone } = req.body
  try {
    const result = await service.updateContact(id, { name, email, phone })
    if (result) {
      res.json({
        status: 'success',
        code: 200,
        data: { contact: result },
      })
    } else {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: `Not found contact id: ${id}`,
        data: 'Not Found',
      })
    }
  } catch (e) {
    console.error(e)
    next(e)
  }
}

const updateContactStatus = async (req, res, next) => {
    const { id } = req.params
    if (!req.body.favorite) {
        res.status(400).json({
        status: 'error',
        code: 400,
        message: `missing field favorite`,
        data: 'Not Found',
      })
    }
  const { favorite = false} = req.body

  try {
    const result = await service.updateContact(id, { favorite })
    if (result) {
      res.json({
        status: 'success',
        code: 200,
        data: { contact: result },
      })
    } else {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: `Not found contact id: ${id}`,
        data: 'Not Found',
      })
    }
  } catch (e) {
    console.error(e)
    next(e)
  }
}

const removeContact = async (req, res, next) => {
  const { id } = req.params

  try {
    const result = await service.removeContact(id)
    if (result) {
      res.json({
        status: 'success',
          code: 200,
          message:'contact deleted',
          data: { contact: result },
      })
    } else {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: `Not found contact id: ${id}`,
        data: 'Not Found',
      })
    }
  } catch (e) {
    console.error(e)
    next(e)
  }
}

module.exports = {
  getContacts,
  getContactById,
  createContact,
  removeContact,
  updateContact,
  updateContactStatus
}
