'use strict'

const mongoose = require('mongoose')
const initialSetup = require('../models/initial_setup')
require('../models/sensor.model')

const settings = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 90000
}

mongoose.set('strictQuery', false)

mongoose.connect(process.env.MONGODB_URI, settings, (err) => {
  if (!err) {
    initialSetup.createSensors()
    console.log('MongoDB connected')
  } else {
    console.log(`Error in MongoDB connection: ${err}`)
  }
})
