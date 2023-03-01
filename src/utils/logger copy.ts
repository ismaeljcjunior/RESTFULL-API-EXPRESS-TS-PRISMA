import { createLogger, format, transports } from 'winston'
const { combine, timestamp, json, errors } = format

export const logger = createLogger({
    format: combine(
        errors({ stack: true }),
        format.splat(),
        format.json(),
        format.simple(),
        format.timestamp({ format: "HH:mm:ss - DD-MM-YYYY" }),
        format.printf(info => {
            if (info.stack) {
                return `[${info.timestamp}] ${info.level} ${info.stack}`;
            }
            return `[${info.timestamp}] ${info.level} ${info.message}`;
        }),
        format.printf(error => {
            if (error.stack) {
                return `[${error.timestamp}] ${error.level} ${error.stack}`;
            }
            return `[${error.timestamp}] ${error.level} ${error.message}`;
        }),
    ),
    transports: [
        new transports.File({
            filename: `logger/error.log`,
            level: 'error',
            maxsize: 50000000, // 50MB
            maxFiles: 5,
            tailable: true, // Sobrescrever o primeiro arquivo
            
        }),
        new transports.File({
            filename: `logger/info.log`,
            level: 'info',
            maxsize: 50000000, // 50MB
            maxFiles: 5,
            tailable: true, // Sobrescrever o primeiro arquivo
        })
    ]
})



