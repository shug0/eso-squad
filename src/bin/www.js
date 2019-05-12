import debug from 'debug'
import http from 'http'
import SocketServer from 'socket.io'

import app from '../app'
import socketConfig from '../sockets/config.json'
import initSocket from '../sockets/base'

// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || '8080')
app.set('port', port)

const server = http.createServer(app)

// Socket IO Config
const io = new SocketServer(socketConfig)
io.listen(server)
initSocket(io)

// Listen on provided port, on all network interfaces.
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

// Normalize a port into a number, string, or false.
function normalizePort (val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

// Event listener for HTTP server "error" event.
function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
    default:
      throw error
  }
}

// Event listener for HTTP server "listening" event.
function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('eso-squad-back:server')('Listening on ' + bind)
}
