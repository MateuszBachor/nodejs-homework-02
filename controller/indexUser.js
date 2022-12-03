const jwt = require('jsonwebtoken')
const User = require('./../models/shemas/user')
require('dotenv').config()
const secret = process.env.SECRET
const gravatar = require('gravatar');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { nanoid } = require("nanoid");
const { restart } = require('nodemon');



const login =  async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user || !user.validPassword(password)) {
    return res.status(400).json({
      status: 'Bad request',
      code: 400,
      data: {
      message: 'Incorrect login or password'
      }
    })
  }
  if (!user.verify) {
    return res.status(401).json({
      status: 'Unauthorized',
      code: 401,
      data: {
        message:'Not verified email'
      }
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
      message:token,
    },
  })
} 

const registration = async (req, res, next) => {
  const { email, password } = req.body
  const newVerificationToken = nanoid();
  const user = await User.findOne({ email }) 
  if (user) {
    return res.status(409).json({
      status: 'Conflict',
      code: 409,
      data: {
      message: 'Email is already in use'
      }
    })
  }
    const msg = {
  to: email,
  from: 'mateuszbachor3@gmail.com',
  subject: 'Confirm email',
     html: `
    <div>
      <h2> Confirm your email </h2>
      <p> Click link to active your account </p>
      <a href="http://localhost:3000/api/users/verify/${newVerificationToken}">Confirm</a>
    </div>`,
};



  try {
    const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'monsterid' })
    const newUser = new User({  email, avatarURL: avatar, verificationToken:newVerificationToken })
    newUser.setPassword(password)
    await newUser.save()
    await sgMail
  .send(msg)
  .then(() => {
    return res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        message: 'Registration successful, email sent',
      },
    })
  })
  .catch(error => {
    return res.status(400).json({
      status: 'Bad request',
      code: 400,
      data: {
        message: "error email"
      }
    })
  });
   
  } catch (error) {
    next(error)
  }
}
const verificationToken = async (req, res, next) => {
  const {verificationToken} = req.params
  const user = await User.findOne({verificationToken})

  if (user) {
      if (user.verify) {
    return res.status(404).json({
      status:"Bad request",
      code: 400,
        data:{
        message:" Verification has already been passed"
        },
  })
}
    const updateUser = await User.findOneAndUpdate({verificationToken}, {verify:true, verificationToken:null})    
    res.status(200).json({
      status: 'succes',
      code: 200,
      data: {
        message:'Verification successful'
      }
    })
  }
      else {
    res.status(404).json({
      status: 'Not Found',
      code: 404,
      data: {
        message:'User not found'
      }
    })
    }
}
const resendingEmail = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email })
  if (!email) {
    return res.status(400).json({
      status: "Bad request",
      code: 400,
      data: {
         message:"missing required field email"
      }
    })
  }
  if (!user) {
    return res.status(404).json({
      status: "Not found",
      code: 404,
      data: {
        message:"Please registration"
      }
    })
  }
  if (user.verify) {
    return res.status(400).json({
      status: "Bad request",
      code: 400,
      data: {
        message:"Verification has already been passed"
      }
    })
  }
   const msg = {
  to: email,
  from: 'mateuszbachor3@gmail.com',
  subject: 'Confirm email',
     html: `
    <div>
      <h2> Confirm your email </h2>
      <p> Click link to active your account </p>
      <a href="http://localhost:3000/api/users/verify/${user.verificationToken}">Confirm</a>
    </div>`,
};

  await sgMail
    .send(msg)
    .then(() => {
      res.status(200).json({
        status: "Ok",
        code: 200,
        data: {
          message: "Verification email sent"
        }
      })
    })
  .catch(error => {
    res.status(400).json({
      status: 'Bad request',
      code: 400,
      data: {
        message: "error email"
      }
   })
  });
} 

module.exports = {
    registration,
    login,
  verificationToken,
    resendingEmail
}
