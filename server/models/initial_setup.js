const Sensor = require('../models/sensor.model');

const initialSetup = {
    createSensors: async () => {
        try {
            const count = await Sensor.estimatedDocumentCount();
            if (count > 0) return;
            const values = await Promise.all([
                new Sensor({ alias: 'a', serial_number: '', user_id: '', image: '' }).save(),
                new Sensor({ alias: 'b', serial_number: '', user_id: '', image: ''  }).save(),
                new Sensor({ alias: 'c', serial_number: '', user_id: '', image: '' } ).save(),
            ]);
            console.log('initial setup: ', values);
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = initialSetup;