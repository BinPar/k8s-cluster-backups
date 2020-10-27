import * as winston from 'winston';

/** 
 * Creates and setups the default logger
 * generating error and combined logs in the
 * logs folder
 */
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});
 
/**
 * Adds the log to console to the logger
 */
logger.add(new winston.transports.Console({
  format: winston.format.simple(),
}));

/**
 * Exports the logger
 */
export default logger;