const express = require('express')
const createError = require('http-errors');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router()
const passport = require('passport')
const ctrlContact = require('../../controller/indexContacts')
const ctrlUser = require('../../controller/indexUser')
const jwt = require('jsonwebtoken')
const User = require('../../models/shemas/user')
require('dotenv').config()
const secret = process.env.SECRET
const multer = require('multer');
const { required } = require('joi');
const uploadDir = path.join(process.cwd(), 'tmp');
const storeImage = path.join(process.cwd(), 'tmp');
const Jimp = require('jimp') ;


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
  const { email,subscription,avatarURL } = req.user
  
  res.json({
    status: 'success',
    code: 200,
    data: {
      message: `Authorization was successful`,
      email: `${email}`,
      subscription: `${subscription}`,
      avatarURL: `${avatarURL}`
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});

const upload = multer({
  storage: storage,
});

router.post('/users/avatars', auth, upload.single('picture'), async (req, res, next) => {
  const { description } = req.body;
  const { path: temporaryName, originalname } = req.file;
  const fileName = path.join(storeImage, originalname);
      
  let randomString = (Math.random() + 1).toString(36).substring(7);
  let pathPicture = '/avatars/'+req.user._id+randomString+'.jpg'
Jimp.read ( fileName ,  ( err ,  img )  =>  { 
  if  ( err )  throw  err ; 
  img 
    .resize ( 250 ,  250 )  
    .write ('./public'+pathPicture)} 
  );
        const userId = { _id: req.user._id }
        const newAvatar = { avatarURL: pathPicture }
       await User.findOneAndUpdate(userId, newAvatar)
  
  res.json({ description, message: "success", status: 200 });
});


router.get('/users/verify/:verificationToken', ctrlUser.verificationToken)
router.post('/users/verify/',ctrlUser.resendingEmail)
module.exports = router;
