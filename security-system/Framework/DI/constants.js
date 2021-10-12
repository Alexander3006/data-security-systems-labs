'use strict';

const SINGLETON = 1;
const TRANSIENT = 2;
const TypeGet = {
  [SINGLETON]: (provider) => provider,
  [TRANSIENT]: (provider) => provider(),
};
const TypeSet = {
  [TRANSIENT]: (provider) => provider,
  [SINGLETON]: (provider) => provider(),
};

const SERVICES = Symbol('SERVICES');

module.exports = {
  SINGLETON,
  TRANSIENT,
  TypeGet,
  TypeSet,
  SERVICES,
};
