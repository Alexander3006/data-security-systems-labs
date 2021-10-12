(class Startup {
  configureServices(services) {
    services.addSingleton(interfaces.ILogger, Logger);
    services.addSingleton(interfaces.Database, Database);
    services.addSingleton(interfaces.ISessionStorage, MemorySessionStorage);
    services.addSingleton(interfaces.ISessionService, Sessions);
    services.addSingleton(interfaces.IRouter, Router);

    services.addSingleton(interfaces.IUser, User);
    services.addSingleton(interfaces.IQuestion, Question);
  }

  async configure({[interfaces.ILogger]: logger, [interfaces.Database]: database}) {
    logger.info('Configure ...');
    const sql = await node_modules.fs.promises.readFile(configuration.db.init, {
      encoding: 'utf-8',
    });
    await database.query(sql);
  }
});
