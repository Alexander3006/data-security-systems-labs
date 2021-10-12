'use strict';

const ApplicationBuilder = require('./Framework/ApplicationBuilder');
const configuration = require('./config');
const {controllers, http, dependencies: depPath} = require('./config');
const dependencies = require(depPath);
const {interfaces} = dependencies;
const HttpTransport = require('./Framework/Transport/http/HttpTransport');
const HttpEndpoint = require('./Framework/Services/Router/HttpEndpoint');

(async () => {
  try {
    const applicationBuilder = new ApplicationBuilder()
      .setConfigurations(configuration)
      .setDependencies(dependencies);
    await applicationBuilder.buildServices();
    await applicationBuilder.build();
    const httpTransport = applicationBuilder
      .useTransport(HttpTransport, HttpEndpoint, {
        router: interfaces.IRouter,
        logger: interfaces.ILogger,
        transport: http,
        controllers,
      })
      .startListen();
  } catch (err) {
    console.dir(err);
  }
})();

process.on('unhandledRejection', (err) => console.dir(err));
