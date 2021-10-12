const {ILogger} = interfaces;

class Redis {
  constructor(logger) {
    const {redis} = node_modules;
    this.client = redis.createClient(redis);
    this.client.on('connect', () => {
      logger.info(`Redis connected`);
    });
    this.client.on('error', (err) => {
      logger.info(err);
    });
    return this.client;
  }
}

({
  imports: [ILogger],
  factory: ({[ILogger]: logger}) => {
    const redis = new Redis(logger);
    return redis;
  },
});
