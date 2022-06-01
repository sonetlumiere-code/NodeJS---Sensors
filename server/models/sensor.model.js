'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let SensorSchema = Schema({
	alias: String,
	serial_number: String,
	user_id: String,
	image: String
}, {
	versionKey: false,
	timestamps: true
});

module.exports = mongoose.model('Sensor', SensorSchema);
