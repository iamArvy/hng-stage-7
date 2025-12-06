import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

export const winstonConfig = {
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports: [
    // Console logging
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        nestWinstonModuleUtilities.format.nestLike(), // Nest-style formatting
      ),
    }),
    // File logging for errors
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // File logging for all logs
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
};
