const morgan = require('morgan');
const { format } = require('date-fns');
const rfs = require('rotating-file-stream');
const path = require('path');

const rfsStream = rfs.createStream("log.txt", {
    size: '10M', // rotate every 10 MegaBytes written
    interval: '7d', // rotate weekly
    //compress: 'gzip' // compress rotated files
    path: path.resolve(__dirname, '..', '..', 'logs')
})

morgan.token('date', function(){
    const dateTime = `${format(new Date(), 'yyyy/MM/dd HH:mm:ss')}`;
    return dateTime
})

const logger = morgan(':remote-addr :method :url :status [:date] - :response-time ms', {
    stream: rfsStream
})

module.exports.logger = logger;