function trustIP(req, res, next) {
    let trustedIPs = ['**.**.**.**'];
    let requestIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if(requestIP.substr(0, 7) == '::ffff:'){
        requestIP = requestIP.substr(7)
    }
    if(trustedIPs.indexOf(requestIP) >= 0) {
        next()
    } else {
        res.status(403).send('not trusted IP')
    }
};

function blockIP(req, res, next) {
    let blockedIPs = ['**.**.**.**'];
    let requestIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if(requestIP.substr(0, 7) == '::ffff:'){
        requestIP = requestIP.substr(7)
    }
    if(blockedIPs.indexOf(requestIP) >= 0) {
        res.status(403).send('blocked IP')
    } else {
        next()
    }
}

module.exports.trustIP = trustIP;
module.exports.blockIP = blockIP;