
class Sensor {
    constructor (alias, serialNumber, userId, image) {
        this.alias = alias;
        this.serialNumber = serialNumber;
        this.userId = userId;
        this.image = image;
    }
};

let sensors = [];

const apiService = {
    getSensors: async () => {
        try {
            const res = await fetch('http://localhost:4000/api/sensors');
            if (res.ok) {
                let data = await res.json();
                console.log('get all: ', data);
                return data.sensors;
            }    
        } catch (error) {
            console.log(error);
        }
    },
    getSensor: async (id) => {
        try {
            const res = await fetch(`http://localhost:4000/api/sensor/${id}`);
            if (res.ok) {
                let data = await res.json();
                console.log('get one: ', data);
                return data.sensor;
            }    
        } catch (error) {
            console.log(error);
        }
    },
    createSensor: async (sensor) => {
        const postData = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            method: 'POST',
            body: JSON.stringify(sensor)
        }    
        try {
            const res = await fetch('http://localhost:4000/api/save-sensor', postData)
            if (res.ok) {
                const data = await res.json();
                console.log('created: ', data);
                return data.sensor;
            }
        } catch(error) {
            console.log(error);
        }
    },
    updateSensor: async (sensor, sensorId) => {
        const putData = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            method: 'PUT',
            body: JSON.stringify(sensor)
        }    
        try {
            const res = await fetch(`http://localhost:4000/api/sensor/${sensorId}`, putData)
            if (res.ok) {
                const data = await res.json();
                console.log('updated: ', data);
                return data;
            }
        } catch(error) {
            console.log(error);
        }
    },
    deleteSensor: async (sensor) => {   
        try {
            const res = await fetch(`http://localhost:4000/api/sensor/${sensor._id}`, { method: 'DELETE' })
            if (res.ok) {
                const data = await res.json();
                console.log('deleted: ', data);
            }
        } catch(error) {
            console.log(error);
        }
    }
};


const getSensors = async () => {
    sensors = await apiService.getSensors();
    render(sensors);
}
getSensors();

const createSensor = async () => {
    const createForm = document.querySelector('#create-form');
    const formData = new FormData(createForm);
    const sensor = new Sensor(formData.get('alias'), formData.get('serialNumber'), formData.get('userId'), '');
    await apiService.createSensor(sensor);
    createForm.reset();
    renderAlert(`Sensor creado con éxito`, 'alert-success');
    getSensors();
};

const deleteSensor = async (sensor) => {
    await apiService.deleteSensor(sensor);
    renderAlert('Sensor eliminado', 'alert-danger');
    getSensors();
};

const updateSensor = async () => {
    const updateForm = document.querySelector('#update-form');
    const formData = new FormData(updateForm);
    const sensor = new Sensor(formData.get('alias'), formData.get('serialNumber'), formData.get('userId'), '');
    await apiService.updateSensor(sensor, formData.get('id'));
    renderAlert('Sensor actualizado', 'alert-warning');
    getSensors();
};


// Render cards
const render = (data) => {
    let container = document.getElementById('cards-container');
    container.innerHTML = '';
    data.forEach(item => {
        let card = document.createElement('div');
        card.classList.add('card');
        //let img = document.createElement('img');
        //img.src = item.img;
        //img.classList.add('card-img-top');
        //img.alt = item.name;
        let cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        let h5 = document.createElement('h5');
        h5.classList.add('card-title');
        h5.textContent = item.alias;
        let p = document.createElement('p');
        p.classList.add('card-text');
        p.textContent = item.year;
        let btnDelete = document.createElement('btn');
        btnDelete.classList.add('btn');
        btnDelete.classList.add('btn-primary');
        btnDelete.textContent = 'Delete';
        btnDelete.onclick = () => deleteSensor(item);
        let btnEdit = document.createElement('btn');
        btnEdit.classList.add('btn');
        btnEdit.classList.add('btn-primary');
        btnEdit.textContent = 'Edit';
        btnEdit.setAttribute('data-bs-toggle', 'modal');
        btnEdit.setAttribute('data-bs-target', '#updateSensorModal');
        btnEdit.onclick = () => renderUpdateModal(item);
        cardBody.appendChild(h5);
        cardBody.appendChild(p);
        cardBody.appendChild(btnDelete);
        cardBody.appendChild(btnEdit);
        //card.appendChild(img);
        card.appendChild(cardBody);
        container.appendChild(card);
    });
};


// Render update modal
const renderUpdateModal = (sensor) => {
    let form = document.querySelector('#update-form');
    form.innerHTML = '';
    let inputId = document.createElement('input');
    inputId.type = 'text';
    inputId.name = 'id';
    inputId.value = sensor._id;
    inputId.setAttribute('readonly', 'true');
    let inputAlias = document.createElement('input');
    inputAlias.type = 'text';
    inputAlias.name = 'alias';
    inputAlias.value = sensor.alias;
    let inputSerialNumber = document.createElement('input');
    inputSerialNumber.type = 'text';
    inputSerialNumber.name = 'serialNumber';
    inputSerialNumber.value = sensor.serial_number;
    let inputUserId = document.createElement('input');
    inputUserId.type = 'text';
    inputUserId.name = 'userId';
    inputUserId.value = sensor.user_id;
    form.appendChild(inputId);
    form.appendChild(inputAlias);
    form.appendChild(inputSerialNumber);
    form.appendChild(inputUserId);
};


// Render alert
const renderAlert = (message, context) => {
    const container = document.querySelector('.container');
    let alertDiv = document.createElement('div');
    alertDiv.classList.add('alert');
    alertDiv.classList.add(context);
    alertDiv.setAttribute('role', 'alert');
    alertDiv.textContent = message;
    container.prepend(alertDiv);
    setTimeout(() => container.removeChild(alertDiv), 2400);
}