"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server.ts
var import_express = __toESM(require("express"));
var import_dotenv = __toESM(require("dotenv"));
var import_body_parser = __toESM(require("body-parser"));
var import_client2 = require("@prisma/client");

// src/controller/usuarioController.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var createUser = async (req, res) => {
  try {
    const { nome, email, photoUrl } = req.body;
    const usuario = await prisma.testUser.create({
      data: {
        nome,
        email,
        photoUrl
      }
    });
    res.send(usuario);
  } catch (e) {
    req.log.error(e);
    res.status(500).send(e);
  }
};
var getUsers = async (req, res) => {
  try {
    const usuarios = await prisma.testUser.findMany();
    console.log(usuarios);
    req.log.info(usuarios);
    res.status(200).json({ usuarios });
  } catch (e) {
    req.log.error(e);
    res.status(500).send(e);
  }
};

// src/logger/logger.ts
var import_pino = __toESM(require("pino"));
var import_pino_pretty = __toESM(require("pino-pretty"));
var logger = (0, import_pino.default)({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true
    }
  }
}, (0, import_pino_pretty.default)());

// src/server.ts
var import_cors = __toESM(require("cors"));
import_dotenv.default.config();
var app = (0, import_express.default)();
var prisma2 = new import_client2.PrismaClient();
var port = process.env.PORT;
app.use(import_body_parser.default.json());
app.use((0, import_cors.default)({ origin: "*" }));
app.use(import_express.default.json());
app.use(import_express.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.log = logger.child({
    requestId: Math.random().toString(36).substr(2, 9)
  });
  next();
});
app.post("/usuarios", createUser);
app.get("/usuarios", getUsers);
app.get("/", (req, res) => {
  res.send("Server is running 1.0");
  req.log.info("Server is running 1.0");
});
app.listen(port, () => {
  console.log(`\u26A1\uFE0F[${port}]: Server is running at http://localhost:${port}`);
  logger.info(`\u26A1\uFE0F[${port}]: Server is running at http://localhost:${port}`);
});
