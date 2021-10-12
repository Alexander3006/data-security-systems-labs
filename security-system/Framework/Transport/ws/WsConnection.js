'use strict';

const BaseConnection = require('../BaseConnection');

class WsConnection extends BaseConnection {
  constructor(services, socket, request) {
    super(services);
    this.socket = socket;
    this.request = request;
  }

  getSessionToken() {
    const {
      request: {url, headers},
    } = this;
    const token = new URL(url, `ws://${headers.host}`).searchParams.get('token');
    return token;
  }

  setSessionToken(token) {
    super.setSessionToken(token);
    this.send({
      event: 'SET_SESSION_TOKEN',
      data: {
        token,
      },
    });
    return this;
  }

  deleteSessionToken(token) {
    super.deleteSessionToken(token);
    this.send({
      event: 'DELETE_SESSION_TOKEN',
      data: {
        token,
      },
    });
    return this;
  }

  error(code, message) {
    this.send({
      event: 'ERROR',
      data: {
        code,
        message,
      },
    });
  }

  send(data) {
    const {socket} = this;
    const json = JSON.stringify(data);
    socket.send(json);
  }

  destroy() {
    const {socket} = this;
    socket.terminate();
    return;
  }
}

module.exports = WsConnection;
