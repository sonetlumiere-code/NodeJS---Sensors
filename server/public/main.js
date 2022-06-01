
let sensors = [];

// Get All
const getSensors = (async () => {
    try {
        const res = await fetch('http://localhost:4000/api/sensors');
        if (res.ok) {
            let data = await res.json();
            console.log('get all: ', data);
            sensors = data.sensors;
            render(sensors);
            getSensor(sensors[1]['_id']);
        }    
    } catch (error) {
        console.log(error);
    }
})();


// Get One
const getSensor = async (id) => {
    try {
        const res = await fetch(`http://localhost:4000/api/sensor/${id}`);
        if (res.ok) {
            let data = await res.json();
            console.log('get one: ', data);
        }    
    } catch (error) {
        console.log(error);
    }
}


// Create
const createSensor = async (sensor) => {
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
        }
    } catch(error) {
        console.log(error);
    }
}
//createSensor({ alias: 'z', serialNumber: '', userId: '', image: '' });



// Update
const updateSensor = async (sensor) => {
    const putData = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, 
        method: 'PUT',
        body: JSON.stringify(sensor)
    }    
    try {
        const res = await fetch(`http://localhost:4000/api/sensor/${sensor._id}`, putData)
        if (res.ok) {
            const data = await res.json();
            console.log('updated: ', data);
            sensors.splice(sensors.findIndex(sensor => sensor._id == data.sensor._id), 1, data.sensor);
            render(sensors);
        }
    } catch(error) {
        console.log(error);
    }
}
//setTimeout(() => updateSensor({ _id: '6296f10ea2167d8830537804', alias: 'www', serialNumber: '', userId: '', image: '' }), 3000);



const deleteSensor = async (sensor) => {   
    try {
        const res = await fetch(`http://localhost:4000/api/sensor/${sensor._id}`, { method: 'DELETE' })
        if (res.ok) {
            const data = await res.json();
            console.log('deleted: ', data);
            sensors.splice(sensors.findIndex(sensor => sensor._id == data.sensor._id), 1);
            render(sensors);
        }
    } catch(error) {
        console.log(error);
    }
}
//setTimeout(() => deleteSensor(sensors[1]), 4000);






// Render
const render = (data) => {
    let container = document.getElementById('cards-container');
    container.innerHTML = '';
    data.forEach(item => {
        let card = document.createElement('div');
        card.classList.add('card');
        card.style = 'width: 18rem';
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
        let a = document.createElement('a');
        a.href = '#';
        a.classList.add('btn')
        a.classList.add('btn-primary');
        a.textContent = 'Go';
        cardBody.appendChild(h5);
        cardBody.appendChild(p);
        cardBody.appendChild(a);
        //card.appendChild(img);
        card.appendChild(cardBody);
        container.appendChild(card);
    })
}
