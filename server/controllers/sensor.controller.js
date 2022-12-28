'use strict'

const Sensor = require('../models/sensor.model')
const fs = require('fs')

const sensorController = {

  saveSensor: (req, res) => {
    const sensor = new Sensor()
    const { alias, serialNumber, userId } = req.body
    sensor.alias = alias
    sensor.serial_number = serialNumber
    sensor.user_id = userId
    sensor.image = ''
    sensor.save((err, sensorStored) => {
      if (err) return res.status(500).send({ message: 'Error al guardar el documento' })
      if (!sensorStored) return res.status(404).send({ message: 'No se pudo guardar el documento' })
      return res.status(200).send({ sensor: sensorStored })
    })
  },

  getSensor: (req, res) => {
    const sensorId = req.params.id
    if (sensorId == null) return res.status(404).send({ message: 'El documento no existe' })
    Sensor.findById(sensorId, (err, sensor) => {
      if (err) return res.status(500).send({ message: 'Error al devolver los datos' })
      if (!sensor) return res.status(404).send({ message: 'El documento no existe' })
      return res.status(200).send({ sensor })
    })
  },

  getSensors: async (req, res) => {
    Sensor.find({}).sort().exec((err, sensorsFound) => {
      if (err) return res.status(500).send({ message: 'Error al devolver los datos' })
      if (!sensorsFound) return res.status(404).send({ message: 'No hay documentos que mostrar' })
      const sensors = sensorsFound.map(({ _id, alias, serial_number, user_id }) => ({ _id, alias, serial_number, user_id }))
      return res.status(200).send({ sensors })
    })
  },

  updateSensor: (req, res) => {
    const sensorId = req.params.id
    const { alias, serialNumber, userId } = req.body
    const sensor = {}
    sensor.alias = alias
    sensor.serial_number = serialNumber
    sensor.user_id = userId
    Sensor.findByIdAndUpdate(sensorId, sensor, { new: true }, (err, sensorUpdated) => {
      if (err) return res.status(500).send({ message: 'Error al actualizar' })
      if (!sensorUpdated) return res.status(404).send({ message: 'No existe el documento para actualizar' })
      return res.status(200).send({ sensor: sensorUpdated })
    })
  },

  deleteSensor: (req, res) => {
    const sensorId = req.params.id
    Sensor.findById(sensorId, (err, res) => {
      if (err) return res.status(500).send({ message: 'Error al buscar documento' })
      if (res.image) {
        fs.unlink('./uploads/' + res.image, (err) => {
          if (err) return res.status(500).send({ message: 'No se ha podido borrar la imagen' })
        })
      }
    })

    Sensor.findByIdAndRemove(sensorId, (err, sensorRemoved) => {
      if (err) return res.status(500).send({ message: 'No se ha podido borrar el documento' })
      if (!sensorRemoved) return res.status(404).send({ message: 'No se pudo borrar el documento' })
      return res.status(200).send({ sensor: sensorRemoved })
    })
  }

}

module.exports = sensorController
