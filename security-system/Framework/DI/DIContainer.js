'use strict';

const DS = require('./DependencySolver');
const {TRANSIENT, SINGLETON, TypeSet, TypeGet, SERVICES} = require('./constants');

module.exports = class DIContainer {
  constructor() {
    this.isBuild = false;
    this.metadata = {};
    this.dependencySolver = new DS();
    this.container = new Proxy(
      {},
      {
        get: (target, IService) => {
          if (IService === SERVICES) return this.container;
          if (IService in target) {
            const {type, service} = target[IService];
            return TypeGet[type](service);
          } else {
            throw new Error(`The ${IService} service does not exist`);
          }
        },
        set: (target, prop, value) => {
          if (this.isBuild) return false;
          const {type, factory} = value;
          target[prop] = {
            type,
            service: TypeSet[type](factory),
          };
          return true;
        },
      },
    );
  }

  _isFactory(fn) {
    return typeof fn === 'function';
  }

  _isIService(Iservice) {
    return typeof Iservice === 'symbol';
  }

  _registerService(type, IService, provider) {
    const {dependencySolver, _isFactory, _isIService} = this;
    if (!_isIService(IService)) {
      throw new Error(`Service name should be a Symbol`);
    }
    const {imports, factory} = provider;
    if (!_isFactory(factory)) {
      throw new Error(`The ${IService.toString()} service factoty is not a function`);
    }
    dependencySolver.addNode(
      IService,
      imports.filter((dep) => dep !== SERVICES),
    );
    this.metadata[IService] = {
      type: type,
      factory: factory,
      imports: imports,
    };
  }

  _inject(factory, imports) {
    const args = imports.reduce((acc, dep) => Object.assign(acc, {[dep]: this.container[dep]}), {});
    return factory.bind(null, args);
  }

  addSingleton(IService, provider) {
    this._registerService(SINGLETON, IService, provider);
    return this;
  }

  addTransient(IService, provider) {
    this._registerService(TRANSIENT, IService, provider);
    return this;
  }

  build() {
    const {dependencySolver, metadata, container} = this;
    const solutions = dependencySolver.getSolvedDependency();
    solutions.map((solution) => {
      const {name} = solution;
      const {type, factory, imports} = metadata[name];
      const bindedFactory = this._inject(factory, imports);
      container[name] = {
        type,
        factory: bindedFactory,
      };
    });
    this.isBuild = true;
    return container;
  }
};
