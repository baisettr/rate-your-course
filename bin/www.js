var app = require('../app');
var debug = require('debug')('ryc:server')
var http = require('http');

var port = checkPort(process.env.PORT || '3001');
app.set('port', port);

var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening)


function checkPort(value) {
    let port = parseInt(value, 10);

    if (isNaN(port)) {
        return value;
    }
    if (port >= 0) {
        return port
    }
    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var address = server.address();
    var bind = typeof address === 'string' ? 'Pipe ' + address : 'Port ' + address.port;
    debug('Listening on ' + bind);
}