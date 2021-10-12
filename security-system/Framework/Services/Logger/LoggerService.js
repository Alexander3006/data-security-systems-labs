class Logger extends ports.BaseLoggerService {
  constructor() {
    super();
  }

  info(message, data = {}) {
    nodeApi.console.dir({message, data});
  }

  warning(message, data = {}) {
    nodeApi.console.dir({message, data});
  }

  silly(message, data = {}) {
    nodeApi.console.dir({message, data});
  }

  error(message, data = {}) {
    nodeApi.console.dir({message, data});
  }
}

({
  imports: [],
  factory: () => {
    const logger = new Logger();
    return logger;
  },
});
