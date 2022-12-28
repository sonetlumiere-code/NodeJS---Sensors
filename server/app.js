'use strict'

require('dotenv').config()
require('./db/mongodb')

const express = require('express')
const cors = require('cors')
const compression = require('compression')
const errorHandler = require('./middlewares/err/error_handler')
// const { blockIP } = require('./middlewares/ip/verify_ip')

const navRoutes = require('./routes/nav.router')
const sensorRoutes = require('./routes/sensor.router')

const app = express()
app.use(express.static('public'))
app.use(cors())
app.use(compression())
app.use(express.json({ extended: false }))
// app.use(blockIP)

app.use('/', navRoutes)
app.use('/api', sensorRoutes)

app.get('*', (req, res) => {
  res.redirect('/')
})

app.use(errorHandler)

app.listen(process.env.PORT, () => {
  console.log(`Server on port: ${process.env.PORT}`)
})
