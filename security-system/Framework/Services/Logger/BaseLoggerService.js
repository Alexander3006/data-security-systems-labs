'use strict';

class BaseLoggerService {
  constructor() {}

  info(message, data) {
    throw new Error();
  }

  silly(message, data) {
    throw new Error();
  }

  warning(message, error) {
    throw new Error();
  }

  error(message, error) {
    throw new Error();
  }
}

module.exports = BaseLoggerService;
