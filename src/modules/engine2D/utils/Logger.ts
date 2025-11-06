export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = LogLevel.INFO;
  private logs: Array<{ level: LogLevel; message: string; timestamp: Date; context?: string }> = [];

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  private log(level: LogLevel, message: string, context?: string) {
    if (level >= this.logLevel) {
      const logEntry = { level, message, timestamp: new Date(), context };
      this.logs.push(logEntry);
      
      const prefix = context ? `[${context}]` : '';
      const timestamp = logEntry.timestamp.toISOString().split('T')[1].split('.')[0];
      
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(`${timestamp} DEBUG ${prefix} ${message}`);
          break;
        case LogLevel.INFO:
          console.info(`${timestamp} INFO ${prefix} ${message}`);
          break;
        case LogLevel.WARN:
          console.warn(`${timestamp} WARN ${prefix} ${message}`);
          break;
        case LogLevel.ERROR:
          console.error(`${timestamp} ERROR ${prefix} ${message}`);
          break;
      }
    }
  }

  debug(message: string, context?: string) {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: string) {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: string) {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context?: string) {
    this.log(LogLevel.ERROR, message, context);
  }

  getLogs() {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}