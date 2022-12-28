
class Sensor {
  constructor (alias, serialNumber, userId, image) {
    this.alias = alias
    this.serialNumber = serialNumber
    this.userId = userId
    this.image = image
  }
};

let sensors = []

const apiService = {

  getSensors: async () => {
    try {
      const res = await fetch('http://localhost:4000/api/sensors')
      if (res.ok) {
        const data = await res.json()
        console.log('get all: ', data)
        return data.sensors
      }
    } catch (error) {
      console.log(error)
    }
  },

  getSensor: async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/sensor/${id}`)
      if (res.ok) {
        const data = await res.json()
        console.log('get one: ', data)
        return data.sensor
      }
    } catch (error) {
      console.log(error)
    }
  },

  createSensor: async (sensor) => {
    const postData = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(sensor)
    }
    try {
      const res = await fetch('http://localhost:4000/api/save-sensor', postData)
      if (res.ok) {
        const data = await res.json()
        console.log('created: ', data)
        return data.sensor
      }
    } catch (error) {
      console.log(error)
    }
  },

  updateSensor: async (sensor, sensorId) => {
    const putData = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify(sensor)
    }
    try {
      const res = await fetch(`http://localhost:4000/api/sensor/${sensorId}`, putData)
      if (res.ok) {
        const data = await res.json()
        console.log('updated: ', data)
        return data
      }
    } catch (error) {
      console.log(error)
    }
  },

  deleteSensor: async (sensor) => {
    try {
      const res = await fetch(`http://localhost:4000/api/sensor/${sensor._id}`, { method: 'DELETE' })
      if (res.ok) {
        const data = await res.json()
        console.log('deleted: ', data)
      }
    } catch (error) {
      console.log(error)
    }
  }

}

const CRUD = {

  createSensor: async function () {
    const createForm = document.querySelector('#create-form')
    const formData = new FormData(createForm)
    const sensor = new Sensor(formData.get('alias'), formData.get('serialNumber'), formData.get('userId'), '')
    await apiService.createSensor(sensor)
    createForm.reset()
    UI.renderAlert('Sensor creado con éxito', 'alert-success')
    this.getSensors()
  },

  getSensors: async function () {
    sensors = await apiService.getSensors()
    // UI.renderCards(sensors);
    UI.renderTable(sensors)
  },

  updateSensor: async function () {
    const updateForm = document.querySelector('#update-form')
    const formData = new FormData(updateForm)
    const sensor = new Sensor(formData.get('alias'), formData.get('serialNumber'), formData.get('userId'), '')
    await apiService.updateSensor(sensor, formData.get('id'))
    UI.renderAlert('Sensor actualizado', 'alert-info')
    this.getSensors()
  },

  deleteSensor: async function (sensor) {
    await apiService.deleteSensor(sensor)
    UI.renderAlert('Sensor eliminado', 'alert-danger')
    this.getSensors()
  }

}

CRUD.getSensors()

const UI = {

  renderCards: (data) => {
    const container = document.querySelector('#cards-container')
    container.innerHTML = ''
    data.forEach(item => {
      const card = document.createElement('div')
      card.classList.add('card')
      const cardBody = document.createElement('div')
      cardBody.classList.add('card-body')
      const h5 = document.createElement('h5')
      h5.classList.add('card-title')
      h5.textContent = item.alias
      const p = document.createElement('p')
      p.classList.add('card-text')
      p.textContent = item.year
      const btnDelete = document.createElement('btn')
      btnDelete.classList.add('btn', 'btn-primary')
      btnDelete.textContent = 'Delete'
      btnDelete.onclick = () => CRUD.deleteSensor(item)
      const btnEdit = document.createElement('btn')
      btnEdit.classList.add('btn', 'btn-primary')
      btnEdit.textContent = 'Edit'
      btnEdit.setAttribute('data-bs-toggle', 'modal')
      btnEdit.setAttribute('data-bs-target', '#updateSensorModal')
      btnEdit.onclick = () => UI.renderUpdateModal(item)
      cardBody.appendChild(h5)
      cardBody.appendChild(p)
      cardBody.appendChild(btnDelete)
      cardBody.appendChild(btnEdit)
      card.appendChild(cardBody)
      container.appendChild(card)
    })
  },

  renderTable: (data) => {
    const container = document.querySelector('#table-container')
    container.innerHTML = ''
    if (!data.length) {
      return
    }
    const table = document.createElement('table')
    table.classList.add('table')
    const tHead = document.createElement('thead')
    const tHeadTr = document.createElement('tr')
    const tHeadTh1 = document.createElement('th')
    tHeadTh1.setAttribute('scope', 'col')
    tHeadTh1.textContent = '#'
    // let tHeadTh2 = document.createElement('th');
    // tHeadTh2.setAttribute('scope', 'col');
    // tHeadTh2.textContent = 'Id';
    const tHeadTh3 = document.createElement('th')
    tHeadTh3.setAttribute('scope', 'col')
    tHeadTh3.textContent = 'Alias'
    const tHeadTh4 = document.createElement('th')
    tHeadTh4.setAttribute('scope', 'col')
    tHeadTh4.textContent = 'Serial Number'
    const tHeadTh5 = document.createElement('th')
    tHeadTh5.setAttribute('scope', 'col')
    tHeadTh5.textContent = 'User Id'
    const tHeadTh6 = document.createElement('th')
    tHeadTh6.setAttribute('scope', 'col')
    tHeadTh6.textContent = 'Edit'
    const tHeadTh7 = document.createElement('th')
    tHeadTh7.setAttribute('scope', 'col')
    tHeadTh7.textContent = 'Delete'
    tHeadTr.appendChild(tHeadTh1)
    // tHeadTr.appendChild(tHeadTh2);
    tHeadTr.appendChild(tHeadTh3)
    tHeadTr.appendChild(tHeadTh4)
    tHeadTr.appendChild(tHeadTh5)
    tHeadTr.appendChild(tHeadTh6)
    tHeadTr.appendChild(tHeadTh7)
    tHead.appendChild(tHeadTr)
    table.appendChild(tHead)
    const tableBody = document.createElement('tbody')
    data.forEach((item, i) => {
      const tableBodyTr = document.createElement('tr')
      const tableBodyTh = document.createElement('th')
      tableBodyTh.setAttribute('scope', 'row')
      tableBodyTh.textContent = i + 1
      // let tableBodyTd1 = document.createElement('td');
      // tableBodyTd1.textContent = item._id;
      const tableBodyTd2 = document.createElement('td')
      tableBodyTd2.textContent = item.alias
      const tableBodyTd3 = document.createElement('td')
      tableBodyTd3.textContent = item.serial_number
      const tableBodyTd4 = document.createElement('td')
      tableBodyTd4.textContent = item.user_id
      const btnEdit = document.createElement('btn')
      btnEdit.classList.add('btn')
      btnEdit.setAttribute('data-bs-toggle', 'modal')
      btnEdit.setAttribute('data-bs-target', '#updateSensorModal')
      btnEdit.onclick = () => UI.renderUpdateModal(item)
      const iconEdit = document.createElement('i')
      iconEdit.classList.add('fas', 'fa-edit')
      btnEdit.appendChild(iconEdit)
      const tableBodyTd5 = document.createElement('td')
      tableBodyTd5.appendChild(btnEdit)
      const btnDelete = document.createElement('btn')
      btnDelete.classList.add('btn')
      btnDelete.onclick = () => CRUD.deleteSensor(item)
      const iconDelete = document.createElement('i')
      iconDelete.classList.add('fa', 'fa-trash')
      iconDelete.setAttribute('aria-hidden', 'true')
      btnDelete.appendChild(iconDelete)
      const tableBodyTd6 = document.createElement('td')
      tableBodyTd6.appendChild(btnDelete)
      tableBodyTr.appendChild(tableBodyTh)
      // tableBodyTr.appendChild(tableBodyTd1);
      tableBodyTr.appendChild(tableBodyTd2)
      tableBodyTr.appendChild(tableBodyTd3)
      tableBodyTr.appendChild(tableBodyTd4)
      tableBodyTr.appendChild(tableBodyTd5)
      tableBodyTr.appendChild(tableBodyTd6)
      tableBody.appendChild(tableBodyTr)
    })
    table.appendChild(tableBody)
    container.appendChild(table)
  },

  renderUpdateModal: (sensor) => {
    const form = document.querySelector('#update-form')
    form.innerHTML = ''

    const divInputId = document.createElement('div')
    divInputId.classList.add('mb-3')
    const labelInputId = document.createElement('label')
    labelInputId.setAttribute('for', 'input-id')
    labelInputId.classList.add('form-label')
    labelInputId.textContent = 'Id'
    const inputId = document.createElement('input')
    inputId.type = 'text'
    inputId.name = 'id'
    inputId.classList.add('form-control')
    inputId.id = 'input-id'
    inputId.value = sensor._id
    inputId.setAttribute('readonly', 'true')
    divInputId.appendChild(labelInputId)
    divInputId.appendChild(inputId)

    const divInputAlias = document.createElement('div')
    divInputAlias.classList.add('mb-3')
    const labelInputAlias = document.createElement('label')
    labelInputAlias.setAttribute('for', 'input-alias')
    labelInputAlias.classList.add('form-label')
    labelInputAlias.textContent = 'Alias'
    const inputAlias = document.createElement('input')
    inputAlias.type = 'text'
    inputAlias.name = 'alias'
    inputAlias.classList.add('form-control')
    inputAlias.id = 'input-alias'
    inputAlias.value = sensor.alias
    divInputAlias.appendChild(labelInputAlias)
    divInputAlias.appendChild(inputAlias)

    const divInputSerialNumber = document.createElement('div')
    divInputSerialNumber.classList.add('mb-3')
    const labelInputSerialNumber = document.createElement('label')
    labelInputSerialNumber.setAttribute('for', 'input-serial-number')
    labelInputSerialNumber.classList.add('form-label')
    labelInputSerialNumber.textContent = 'Serial Number'
    const inputSerialNumber = document.createElement('input')
    inputSerialNumber.type = 'text'
    inputSerialNumber.name = 'serialNumber'
    inputSerialNumber.classList.add('form-control')
    labelInputId.id = 'input-serial-number'
    inputSerialNumber.value = sensor.serial_number
    divInputSerialNumber.appendChild(labelInputSerialNumber)
    divInputSerialNumber.appendChild(inputSerialNumber)

    const divInputUserId = document.createElement('div')
    divInputUserId.classList.add('mb-3')
    const labelInputUserId = document.createElement('label')
    labelInputUserId.setAttribute('for', 'input-user-id')
    labelInputUserId.classList.add('form-label')
    labelInputUserId.textContent = 'User Id'
    const inputUserId = document.createElement('input')
    inputUserId.type = 'text'
    inputUserId.classList.add('form-control')
    inputUserId.name = 'userId'
    labelInputId.id = 'input-user-id'
    inputUserId.value = sensor.user_id
    divInputUserId.appendChild(labelInputUserId)
    divInputUserId.appendChild(inputUserId)
    form.appendChild(divInputId)
    form.appendChild(divInputAlias)
    form.appendChild(divInputSerialNumber)
    form.appendChild(divInputUserId)
  },

  renderAlert: (message, context) => {
    const container = document.querySelector('#alert-container')
    const alertDiv = document.createElement('div')
    alertDiv.classList.add('alert', context)
    alertDiv.setAttribute('role', 'alert')
    alertDiv.textContent = message
    container.appendChild(alertDiv)
    setTimeout(() => container.removeChild(alertDiv), 2400)
  }

}
