'use strict';

const BaseEndpoint = require('./BaseEndpoint');

class WSEndpoint extends BaseEndpoint {
  constructor(controller) {
    const {url, handler} = controller;
    super('WS', url, handler);
  }
}

module.exports = WSEndpoint;
