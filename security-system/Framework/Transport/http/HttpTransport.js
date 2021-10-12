'use strict';

const BaseTransport = require('../BaseTransport');
const Connection = require('./HttpConnection');
const {readFileSync} = require('fs');

class HttpTransport extends BaseTransport {
  constructor(services, configuration) {
    super(services);
    const {ssl, port, ipAddress} = configuration;
    this.port = port;
    this.address = ipAddress;
    const protocol = ssl ? require('https') : require('http');
    const {cert, key} = ssl;
    this.connections = new Map();
    this.server = protocol.createServer(
      ssl
        ? {
            key: readFileSync(key),
            cert: readFileSync(cert),
          }
        : {},
      this._listener.bind(this),
    );
  }

  async _listener(req, res) {
    const {connections, handler, services} = this;
    const {socket} = res;
    const connection = new Connection(services, req, res);
    connections.set(socket, connection);
    const {pathname, method} = connection.getEndpointPath();
    await handler(pathname, method, connection);
    res.on('close', () => {
      connections.delete(socket);
    });
  }

  startListen() {
    const {port, address, server, logger, ssl} = this;
    server.listen(port, address, () => {
      logger.info(`Start server ${ssl ? 'https' : 'http'}://${address}:${port}`);
    });
    return this;
  }

  stopListen() {
    const {connections, server, logger} = this;
    for (const [socket, connection] of connections.entries()) {
      connection.destroy();
      connections.delete(socket);
    }
    server.close(() => {
      logger.info(`Http(s) server closed`);
    });
    return this;
  }
}

module.exports = HttpTransport;
