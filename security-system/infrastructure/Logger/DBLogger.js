class DBLogger extends ports.BaseLoggerService {
  constructor(logging) {
    super();
    this.logging = logging;
  }

  info(message, data = {}) {
    nodeApi.console.dir({message, data});
  }

  warning(message, data = {}) {
    nodeApi.console.dir({message, data});
    return this.logging.log({
      message: message,
      type: 'WARNING',
      grade: data?.grade,
      userId: data?.userId,
    });
  }

  silly(message, data = {}) {
    nodeApi.console.dir({message, data});
    return this.logging.log({
      message: message,
      type: 'SILLY',
      grade: data?.grade,
      userId: data?.userId,
    });
  }

  error(message, error) {
    nodeApi.console.dir({message, error});
  }
}

const {ILogging} = interfaces;

({
  imports: [ILogging],
  factory: ({[ILogging]: logging}) => {
    const logger = new DBLogger(logging);
    return logger;
  },
});
