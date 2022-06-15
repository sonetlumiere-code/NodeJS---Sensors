'use strict'

const Sensor = require('../models/sensor.model');
const fs = require('fs');
const path = require('path');

const sensorController = {
	
	saveSensor: (req, res) => {
		let sensor = new Sensor();
		let { alias, serialNumber, userId } = req.body;
		sensor.alias = alias;
		sensor.serial_number = serialNumber;
		sensor.user_id = userId;
		sensor.image = '';
		sensor.save((err, sensorStored) => {
			if (err) return res.status(500).send({ message: 'Error al guardar el documento' });
			if (!sensorStored) return res.status(404).send({ message: 'No se pudo guardar el documento' });
			return res.status(200).send({ sensor: sensorStored });
		});
	},

	getSensor: (req, res) => {
		let sensorId = req.params.id;
		if(sensorId == null) return res.status(404).send({ message: 'El documento no existe' });
		Sensor.findById(sensorId, (err, sensor) => {
			if (err) return res.status(500).send({ message: 'Error al devolver los datos' });
			if (!sensor) return res.status(404).send({ message: 'El documento no existe' });
			return res.status(200).send({sensor});
		});
	},

	getSensors: async (req, res) => {		
		Sensor.find({}).sort().exec((err, sensors) => {
			if (err) return res.status(500).send({ message: 'Error al devolver los datos' });
			if (!sensors) return res.status(404).send({ message: 'No hay documentos que mostrar' });
			return res.status(200).send({sensors});
		});
	},

	updateSensor: (req, res) => {
		let sensorId = req.params.id;
		let { alias, serialNumber, userId } = req.body;
		let sensor = {};
		sensor.alias = alias;
		sensor.serial_number = serialNumber;
		sensor.user_id = userId;
		Sensor.findByIdAndUpdate(sensorId, sensor, { new: true }, (err, sensorUpdated) => {
			if (err) return res.status(500).send({ message: 'Error al actualizar' });
			if (!sensorUpdated) return res.status(404).send({ message: 'No existe el documento para actualizar' });
			return res.status(200).send({ sensor: sensorUpdated });
		});
	},

	deleteSensor: (req, res) => {
		let sensorId = req.params.id;
		Sensor.findById(sensorId, (err, res) =>{
			if (err) return res.status(500).send({ message: 'Error al buscar documento' });
			if (res.image) {
				fs.unlink('./uploads/' + res.image, (err) => {
					if (err) return res.status(500).send({ message: 'No se ha podido borrar la imagen' });
				})
			}                
		}); 

		Sensor.findByIdAndRemove(sensorId, (err, sensorRemoved) => {
			if (err) return res.status(500).send({ message: 'No se ha podido borrar el documento' });
			if (!sensorRemoved) return res.status(404).send({ message: 'No se pudo borrar el documento' });
			return res.status(200).send({ sensor: sensorRemoved });
		});
	},

	uploadImage: (req, res) => {
		let sensorId = req.params.id;
		let fileName = 'Imagen no subida...';
		if(req.files){
			let filePath = req.files.image.path;
			let fileSplit = filePath.split('\\');
			let fileName = fileSplit[1];
			let extSplit = fileName.split('\.');
			let fileExt = extSplit[1].toLowerCase();
			Sensor.findById(sensorId, (err, res) => {
				if (err) return res.status(500).send({ message: 'Error al buscar documento' });
				if (res.image) {
					fs.unlink('./uploads/' + res.image, (err) => {
						if (err) return res.status(500).send({ message: 'No se ha podido borrar la imagen' });
					})
				}                
			}); 
			if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
				Sensor.findByIdAndUpdate(sensorId, {image: fileName}, {new: true}, (err, sensorUpdated) => {
					if (err) return res.status(500).send({ message: 'La imagen no se ha subido' });
					if (!sensorUpdated) return res.status(404).send({ message: 'El documento no existe y no se ha asignado la imagen' });
					return res.status(200).send({ sensor: sensorUpdated });
				});
			} else {
				fs.unlink(filePath, (err) => {
					return res.status(200).send({ message: 'La extensión no es válida' });
				});
			}
		} else {
			return res.status(200).send({ message: fileName });
		}
	},

	getImageFile: (req, res) => {
		let file = req.params.image;
		let path_file = './uploads/' + file;

		fs.stat(path_file, (exists) => {
			if (exists) {
				return res.sendFile(path.resolve(path_file));
			} else {
				return res.status(200).send({ message: 'No existe la imagen' });
			}
		});
	}
};

module.exports = sensorController;