const { transports, createLogger, format } = require('winston');
const { combine, timestamp, colorize, printf, json } = format;

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5
};

const logAsLine = printf(info =>
  `${info.timestamp} [${info.label || '....'}] ${info.level}: ${info.message}`);

module.exports = createLogger({
  levels,
  transports: [
    new transports.Console({
      json: true,
      colorize: true,
      format: combine(timestamp(), colorize(), logAsLine)
    }),
    new transports.File({
      filename: 'combined.log',
      colorize: false,
      format: combine(timestamp(), json()),
    })
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'exceptions.log' }),
  ],
});
