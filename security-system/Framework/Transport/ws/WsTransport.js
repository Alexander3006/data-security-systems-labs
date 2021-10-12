'use strict';

const BaseTransport = require('../BaseTransport');
const WS = require('ws');
const {readFileSync} = require('fs');
const Connection = require('./WsConnection');

class WsTransport extends BaseTransport {
  constructor(services, configuration) {
    super(services);
    this.connections = new Map();
    const {ssl, port, ipAddress} = configuration;
    const protocol = ssl ? require('https') : require('http');
    this.port = port;
    this.address = ipAddress;
    const {cert, key} = ssl;
    this.ssl = !!ssl;
    this.server = protocol.createServer(
      ssl
        ? {
            cert: readFileSync(cert),
            key: readFileSync(key),
          }
        : null,
    );
    this.wss = new WS.Server({
      server: this.server,
      clientTracking: false,
    })
      .on('connection', this._onConnection.bind(this))
      .on('close', this._onClose.bind(this))
      .on('error', (err) => logger.error('WSS error', err));
  }

  _onConnection(socket, request) {
    const {connections, handler, services} = this;
    const connection = new Connection(services, socket, request);
    connections.set(socket, connection);
    socket.on('close', (_) => {
      connections.delete(socket);
      return;
    });
    socket.on('message', async (message) => {
      const payload = JSON.parse(message);
      const {event, data} = payload;
      await handler(event, 'WS', connection, data);
    });
  }

  _onClose() {
    const {connections, logger} = this;
    logger.info('Ws server closing');
    for (const [socket, connection] of connections.entries()) {
      connection.destroy();
      connections.delete(socket);
    }
    return;
  }

  startListen() {
    const {ssl, port, address, server, logger} = this;
    server.listen(port, address, () => {
      logger.info(`Start WS server ${ssl ? 'wss' : 'ws'}//${address}:${port}`);
    });
    return this;
  }

  stopListen() {
    const {server, logger} = this;
    server.close(() => {
      logger.info(`WS(s) Server closed`);
    });
    return this;
  }
}

module.exports = WsTransport;
