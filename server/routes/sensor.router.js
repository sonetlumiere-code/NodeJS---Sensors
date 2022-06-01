'use strict'

const express = require('express');
const sensorRouter = express.Router();
const sensorController = require('../controllers/sensor.controller');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: './uploads' });

sensorRouter.post('/save-sensor', sensorController.saveSensor);
sensorRouter.get('/sensor/:id?', sensorController.getSensor);
sensorRouter.get('/sensors', sensorController.getSensors);
sensorRouter.put('/sensor/:id', sensorController.updateSensor);
sensorRouter.delete('/sensor/:id', sensorController.deleteSensor);
sensorRouter.post('/upload-image/:id', multipartMiddleware, sensorController.uploadImage);
sensorRouter.get('/get-image/:image', sensorController.getImageFile);

module.exports = sensorRouter;