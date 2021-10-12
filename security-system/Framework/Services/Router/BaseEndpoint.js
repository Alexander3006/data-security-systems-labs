'use strict';

class BaseEndpoint {
  constructor(method, path, handler) {
    this.method = method;
    this.url = path;
    this.handler = handler;
  }

  async execute(connection, services) {
    const {handler} = this;
    const context = {
      services,
    };
    await handler(connection, context);
  }

  getUrl() {
    return this.url;
  }

  getMethod() {
    return this.method.toLowerCase();
  }

  getHandler() {
    return this.handler;
  }
}

module.exports = BaseEndpoint;
