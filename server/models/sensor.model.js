'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SensorSchema = Schema({
  alias: String,
  serial_number: String,
  user_id: String,
  image: String
}, {
  versionKey: false,
  timestamps: true
})

module.exports = mongoose.model('Sensor', SensorSchema)
