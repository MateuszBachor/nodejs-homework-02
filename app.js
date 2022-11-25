const express = require('express')
const logger = require('morgan')
const cors = require('cors')

const contactsRouter = require('./routes/api/routes')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'
app.use(express.static('public'))
app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
require('./config/config-passport')
app.use('/api', contactsRouter)

// app.use((req, res, next) => {
//   next(createError(404));
// });

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ message: err.message, status: err.status });
});



app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app