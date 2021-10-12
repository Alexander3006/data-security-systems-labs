'use strict';

const vm = require('vm');
const fsp = require('fs/promises');
const fs = require('fs');
const path = require('path');

const dependencies = require('../../../dependencies');

class ControllerService {
  constructor(router, logger, Endpoint) {
    this.configuration;
    this.router = router;
    this.logger = logger;
    this.Endpoint = Endpoint;
    this.watchers = new Map();
    this.pathsToControllers = [];
  }

  async start(controllers) {
    this.configuration = controllers;
    await this._detectController();
    await this._registerControllers();
    if (controllers.supervisor) {
      this._addSupervisor();
    }
  }

  _isJsFile(fileName) {
    const {ext} = path.parse(fileName);
    return ext === '.js';
  }

  async _detectController() {
    const {
      configuration: {paths},
    } = this;
    const pathsToJSFiles = await Promise.all(
      paths.map(async (dirPath) => {
        const files = await fsp.readdir(dirPath);
        const jsFiles = await Promise.all(
          files.map(async (file) => {
            const pathToFile = path.join(dirPath, file);
            const stat = await fsp.stat(pathToFile);
            if (!stat.isFile()) return;
            return this._isJsFile(file) ? pathToFile : null;
          }),
        );
        return jsFiles.filter((file) => !!file);
      }),
    );
    this.pathsToControllers = pathsToJSFiles.flat();
    return this;
  }

  async _wrapController(controllerPath) {
    const {nodeApi, node_modules, adapters, interfaces} = dependencies;
    const src = await fsp.readFile(controllerPath);
    const sandbox = vm.createContext({nodeApi, node_modules, adapters, interfaces});
    const script = vm.createScript(src);
    const controller = script.runInNewContext(sandbox);
    return controller;
  }

  async _registerControllers() {
    const {router, pathsToControllers, Endpoint} = this;
    await Promise.all(
      pathsToControllers.map(async (controllerPath) => {
        const controller = await this._wrapController(controllerPath);
        const endpoint = new Endpoint(controller);
        router.registerEndpoint(endpoint);
      }),
    );
    return this;
  }

  _addSupervisor() {
    const {
      configuration: {paths},
    } = this;
    paths.map((path) => {
      this._watch(path);
    });
    return this;
  }

  stopSupervisor() {
    const {watchers} = this;
    for (const [_, watcher] of watchers) {
      watcher.close();
    }
    watchers.clear();
  }

  _watch(dirPath) {
    const {router, watchers, _isJsFile, logger} = this;
    let watchWait = false;
    const watcher = fs.watch(dirPath, async (_, fileName) => {
      //try to prevent duplication of events
      if (watchWait) return;
      watchWait = setTimeout(() => {
        watchWait = false;
      }, 100);
      const filePath = path.join(dirPath, fileName);
      try {
        const stat = await fs.promises.stat(filePath);
        if (stat.isFile()) {
          if (!_isJsFile(fileName)) return;
          const controller = await this._wrapController(filePath);
          if (!controller) return;
          const {handler, method, url} = controller;
          router.deleteEndpoint(handler);
          const endpoint = new this.Endpoint(controller);
          router.registerEndpoint(endpoint);
          logger.info(`The supervisor registered new endpoint: ${method}: ${url}`);
        }
      } catch (err) {
        logger.error(err);
        return;
      }
    });
    watchers.set(dirPath, watcher);
    return this;
  }
}

module.exports = ControllerService;
