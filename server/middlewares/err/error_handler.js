const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const logEvents = async (req, message, logName) => {
    const requestIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const dateTime = `${format(new Date(), 'yyyy/MM/dd HH:mm:ss')}`;
    const logItem = `${requestIP}\t[${dateTime}]\t${uuid()}\t${message}\n`;
    try {
        if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs', 'err'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs', 'err'));
        }
        await fsPromises.appendFile(path.join(__dirname, '..', '..', 'logs', 'err', logName), logItem);
    } catch (err) {
        console.log(err);
    }
}

const errorHandler = (err, req, res, next) => {
    logEvents(req, `${err.name}: ${err.message}`, 'err_log.txt');
    console.error('error handler:', err.stack);
    res.status(500).send(err.message);
}

module.exports = errorHandler;