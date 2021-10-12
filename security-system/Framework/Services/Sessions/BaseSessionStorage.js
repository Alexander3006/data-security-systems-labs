'use strict';

class BaseSessionStorage {
  constructor() {}

  set(token, data) {
    throw new Error();
  }

  get(token) {
    throw new Error();
  }

  delete(token) {
    throw new Error();
  }
}

module.exports = BaseSessionStorage;
