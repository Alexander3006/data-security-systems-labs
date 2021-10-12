'use strict';

const DIContainer = require('./DI/DIContainer');
const vm = require('vm');
const fsp = require('fs').promises;
const ControllerService = require('./Services/Controllers/ControllerService');

class ApplicationBuilder {
  constructor() {
    this.services = {};
    this.dependencies;
    this.container = new DIContainer();
    this.startup;
    this.configuration = {};
    this.servicesPaths;
    this.application;
  }

  setConfigurations(configuration) {
    this.configuration = Object.freeze(configuration);
    return this;
  }

  setDependencies(dependencies) {
    const {node_modules, nodeApi, services, adapters, ports, interfaces} = dependencies;
    this.dependencies = Object.freeze({
      node_modules,
      nodeApi,
      adapters,
      ports,
      interfaces,
    });
    this.servicesPaths = services;
    return this;
  }

  async buildServices() {
    const {servicesPaths, dependencies, configuration} = this;
    await Promise.all(
      Object.keys(servicesPaths).map(async (serviceName) => {
        const servicePath = servicesPaths[serviceName];
        const src = await fsp.readFile(servicePath);
        const sandbox = vm.createContext({...dependencies, ...configuration});
        const script = vm.createScript(src);
        const service = script.runInNewContext(sandbox);
        this.services[serviceName] = service;
      }),
    );
  }

  async build() {
    const {services, dependencies, configuration} = this;
    const context = {...services, ...dependencies, configuration};
    const sandbox = vm.createContext(context);
    const src = await fsp.readFile(configuration.startup);
    const script = vm.createScript(src);
    const Startup = script.runInNewContext(sandbox);
    this.startup = new Startup();
    const {startup, container} = this;
    startup.configureServices(container);
    const application = container.build();
    this.application = application;
    await startup.configure(application);
    return this;
  }

  useTransport(Transport, Endpoint, configuration) {
    const {application} = this;
    const {[configuration.logger]: logger, [configuration.router]: router} = application;
    const transport = new Transport(application, configuration.transport);
    const {controllers} = configuration;
    if (controllers) {
      const controllerService = new ControllerService(router, logger, Endpoint);
      controllerService.start(controllers);
    }
    transport.setHandler(async (pathname, method, connection, data) => {
      await router.indicatePath(pathname, method, connection, data);
    });
    return transport;
  }
}

module.exports = ApplicationBuilder;
