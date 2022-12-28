'use strict'

const express = require('express')
const navRouter = express.Router()
const path = require('path')
const { trustIP, blockIP } = require('../middlewares/ip/verify_ip')
const { logger } = require('../middlewares/logger/logger')

navRouter.get('/', trustIP, (req, res) => {
  res.status(200).sendFile(path.resolve('public/index.html'))
})

navRouter.get('/hello', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

navRouter.get('/trust', [logger, trustIP], (req, res) => {
  res.status(200).send('trusted IP')
})

navRouter.get('/block', blockIP, (req, res) => {
  res.status(200).send('not blocked IP')
})

module.exports = navRouter
