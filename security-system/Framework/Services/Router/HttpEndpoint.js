'use strict';

const BaseEndpoint = require('./BaseEndpoint');

class HttpEndpoint extends BaseEndpoint {
  constructor(controller) {
    const {method, url, handler} = controller;
    super(method, url, handler);
  }
}

module.exports = HttpEndpoint;
