"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/logger.ts
var logger_exports = {};
__export(logger_exports, {
  logger: () => logger
});
module.exports = __toCommonJS(logger_exports);
var import_winston = require("winston");
var { combine, timestamp, json, errors } = import_winston.format;
var logger = (0, import_winston.createLogger)({
  format: combine(
    errors({ stack: true }),
    import_winston.format.splat(),
    import_winston.format.json(),
    import_winston.format.simple(),
    import_winston.format.timestamp({ format: "HH:mm:ss - DD-MM-YYYY" }),
    import_winston.format.printf((info) => {
      if (info.stack) {
        return `[${info.timestamp}] ${info.level} ${info.stack}`;
      }
      return `[${info.timestamp}] ${info.level} ${info.message}`;
    }),
    import_winston.format.printf((error) => {
      if (error.stack) {
        return `[${error.timestamp}] ${error.level} ${error.stack}`;
      }
      return `[${error.timestamp}] ${error.level} ${error.message}`;
    })
  ),
  transports: [
    new import_winston.transports.File({
      filename: `logger/error.log`,
      level: "error",
      maxsize: 5e7,
      // 50MB
      maxFiles: 5,
      tailable: true
      // Sobrescrever o primeiro arquivo
    }),
    new import_winston.transports.File({
      filename: `logger/info.log`,
      level: "info",
      maxsize: 5e7,
      // 50MB
      maxFiles: 5,
      tailable: true
      // Sobrescrever o primeiro arquivo
    })
  ]
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  logger
});
