'use strict'

function trustIP (req, res, next) {
  const trustedIPs = ['**.**.**.**']
  let requestIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  if (requestIP.substr(0, 7) === '::ffff:') {
    requestIP = requestIP.substr(7)
  }
  if (trustedIPs.indexOf(requestIP) >= 0) {
    next()
  } else {
    const error = new Error(`Not trusted IP: ${requestIP} tryed to connect`)
    error.code = 403
    next(error)
  }
}

function blockIP (req, res, next) {
  const blockedIPs = ['**.**.**.**']
  let requestIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  if (requestIP.substr(0, 7) === '::ffff:') {
    requestIP = requestIP.substr(7)
  }
  if (blockedIPs.indexOf(requestIP) >= 0) {
    const error = new Error(`Bloqued IP: ${requestIP} tryed to connect`)
    error.code = 403
    next(error)
  } else {
    next()
  }
}

module.exports.trustIP = trustIP
module.exports.blockIP = blockIP
